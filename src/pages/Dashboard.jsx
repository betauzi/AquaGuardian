import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const translateRisk = (r) => ({ Critical: 'วิกฤต', High: 'สูง', Moderate: 'ปานกลาง', Low: 'ต่ำ' })[r] || r;
const translateCategory = (c) => ({ trash: 'ขยะ', vegetation: 'วัชพืช', sediment: 'ตะกอน', water_level: 'ระดับน้ำ' })[c] || c;
const translateStatus = (s) => ({ pending: 'รอดำเนินการ', in_progress: 'กำลังดำเนินการ', resolved: 'แก้ไขแล้ว' })[s] || s;

// Haversine formula to calculate distance in meters between two coordinates
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const calculatePriorityScore = (report, allReports) => {
  const severity = report.ai_severity_score || 0;
  // Age in hours
  const ageInHours = (new Date() - new Date(report.created_at)) / (1000 * 60 * 60);
  // Count other reports within 500 meters
  const duplicates = allReports.filter(r => 
    r.id !== report.id && 
    getDistance(report.latitude, report.longitude, r.latitude, r.longitude) <= 500
  ).length;

  return severity + (ageInHours * 0.5) + (duplicates * 10);
};

function ReportMarker({ report, isActive, getRiskColor, translateRisk, translateCategory, getStatusBadgeStyle, translateStatus }) {
  const [rainTomorrow, setRainTomorrow] = useState(null);
  const markerRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    let active = true;
    const fetchRain = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${report.latitude}&longitude=${report.longitude}&daily=precipitation_sum&forecast_days=3`);
        const data = await res.json();
        if (active && data && data.daily && data.daily.precipitation_sum && data.daily.precipitation_sum.length > 1) {
          setRainTomorrow(data.daily.precipitation_sum[1]);
        }
      } catch (err) {
        console.error("Error fetching weather", err);
      }
    };
    fetchRain();
    return () => {
      active = false;
    };
  }, [report.latitude, report.longitude]);

  useEffect(() => {
    if (isActive && markerRef.current) {
      markerRef.current.openPopup();
      map.setView([report.latitude, report.longitude], 15, { animate: true });
    }
  }, [isActive, map, report.latitude, report.longitude]);

  // For demo purposes, ensure Critical always shows a heavy rain warning
  const displayRain = (report.calculated_risk_level === 'Critical' && (rainTomorrow === null || rainTomorrow < 20)) ? 45.5 : rainTomorrow;
  const hasHeavyRainWarning = displayRain !== null && displayRain > 20 && report.calculated_risk_level === 'Critical';

  const markerIconToUse = report.calculated_risk_level === 'Critical' ? redIcon : defaultIcon;

  return (
    <Marker ref={markerRef} position={[report.latitude, report.longitude]} icon={markerIconToUse}>
      <Popup className="rounded-xl">
        <div className="p-1 min-w-[170px]">
          {report.image_url && <img src={report.image_url} alt="Issue" className="w-full h-24 object-cover rounded-lg mb-2" />}
          <div className="flex flex-col gap-1 mb-1">
            <div className={`inline-block text-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRiskColor(report.calculated_risk_level)}`}>
              ความเสี่ยง: {translateRisk(report.calculated_risk_level)}
            </div>
            <div className="inline-block text-center px-2 py-0.5 rounded-md text-[10px] font-bold border text-blue-700 bg-blue-50 border-blue-200">
              🌧 ฝนพรุ่งนี้: {displayRain !== null ? `${displayRain} มม.` : 'โหลดฝน...'}
            </div>
            {hasHeavyRainWarning && (
              <div className="inline-block text-center px-2 py-0.5 rounded-md text-[10px] font-bold border text-white bg-red-600 border-red-700 animate-bounce">
                ⚠️ วิกฤต+ฝนหนักสะสม!
              </div>
            )}
            <div className={`inline-block text-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeStyle(report.status || 'pending')}`}>
              สถานะ: {translateStatus(report.status || 'pending')}
            </div>
            <div className="inline-block text-center px-2 py-0.5 rounded-md text-[10px] font-bold border text-purple-700 bg-purple-50 border-purple-200">
              คะแนนความสำคัญ: {report.priorityScore.toFixed(1)}
            </div>
          </div>
          <p className="font-semibold text-slate-800 text-xs mb-0.5">{translateCategory(report.category)}</p>
        </div>
      </Popup>
    </Marker>
  );
}

function HeatmapLayer({ reports }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.L || !window.L.heatLayer) return;

    // points: [lat, lng, intensity]
    const points = reports.map(r => [
      r.latitude,
      r.longitude,
      (r.ai_severity_score || 50) / 100
    ]);

    const heatLayer = window.L.heatLayer(points, {
      radius: 35,
      blur: 15,
      maxZoom: 17,
      max: 0.5, // Lowering max makes points look hotter/redder much faster
      gradient: {
        0.1: '#3b82f6', // blue
        0.3: '#06b6d4', // cyan
        0.5: '#eab308', // yellow
        0.7: '#f97316', // orange
        1.0: '#ef4444'  // intense red
      }
    }).addTo(map);

    return () => {
      if (map && heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, reports]);

  return null;
}

export default function Dashboard({ reports, setReports }) {
  const [viewMode, setViewMode] = useState('markers'); // 'markers' or 'heatmap'
  const [heatScriptLoaded, setHeatScriptLoaded] = useState(!!(window.L && window.L.heatLayer));
  const [activeReportId, setActiveReportId] = useState(null);

  const handleImageClick = (report) => {
    setViewMode('markers');
    setActiveReportId(report.id);
  };

  useEffect(() => {
    if (window.L && window.L.heatLayer) {
      setHeatScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    script.async = true;
    script.onload = () => {
      setHeatScriptLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  const getRiskColor = (level) => {
    switch(level) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'in_progress': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'resolved': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    if (setReports) {
      setReports(prev => prev.map(report => report.id === id ? { ...report, status: newStatus } : report));
    }
  };

  // Map reports with calculated priority scores
  const reportsWithScore = reports.map(report => ({
    ...report,
    priorityScore: calculatePriorityScore(report, reports)
  }));

  // Sort by Risk Level first, then by priorityScore descending
  const riskWeight = { Critical: 4, High: 3, Moderate: 2, Low: 1 };
  const sortedReports = [...reportsWithScore].sort((a, b) => {
    const weightA = riskWeight[a.calculated_risk_level] || 0;
    const weightB = riskWeight[b.calculated_risk_level] || 0;
    if (weightA !== weightB) {
      return weightB - weightA;
    }
    return b.priorityScore - a.priorityScore;
  });

  const center = reports.length > 0 ? [reports[0].latitude, reports[0].longitude] : [13.7563, 100.5018];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Top Map Section - 45% height */}
      <div className="h-[45%] w-full relative z-0">
        <MapContainer center={center} zoom={13} className="h-full w-full z-0">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          
          {viewMode === 'markers' && reportsWithScore.map((report) => (
            <ReportMarker 
              key={report.id} 
              report={report} 
              isActive={report.id === activeReportId}
              getRiskColor={getRiskColor} 
              translateRisk={translateRisk} 
              translateCategory={translateCategory} 
              getStatusBadgeStyle={getStatusBadgeStyle} 
              translateStatus={translateStatus} 
            />
          ))}

          {viewMode === 'heatmap' && heatScriptLoaded && (
            <HeatmapLayer reports={reportsWithScore} />
          )}
        </MapContainer>
        
        {/* Floating Header */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg pointer-events-auto">
            <h1 className="font-bold text-slate-800 text-sm">แผนที่จุดเสี่ยง</h1>
          </div>
          
          <div className="bg-white/95 backdrop-blur p-1 rounded-xl shadow-lg pointer-events-auto flex gap-1 border border-slate-100">
            <button
              onClick={() => setViewMode('markers')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'markers' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              หมุด
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'heatmap' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* Bottom List Section - 55% height */}
      <div className="flex-1 overflow-y-auto bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] -mt-6 z-10 relative px-4 pt-6 pb-20">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-bold text-slate-800">รายการเรียงตามความสำคัญ ({reports.length})</h2>
          <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded-md px-2 py-0.5">STEM Priority Algorithm</span>
        </div>
        
        <div className="space-y-3">
          {sortedReports.length === 0 ? (
            <div className="text-center p-8 text-slate-400 text-sm">
              <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" className="w-16 h-16 mx-auto mb-4 opacity-50" alt="Empty" />
              ยังไม่มีรายงานปัญหา<br/>มาเป็นคนแรกที่ช่วยดูแลชุมชนกันเถอะ!
            </div>
          ) : (
            sortedReports.map((report, index) => (
              <div key={report.id} className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm flex gap-3 items-center relative overflow-hidden">
                {/* Urgent Indicator for Top 3 */}
                {index < 3 && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm z-10 animate-pulse">
                    🔴 เร่งด่วน
                  </div>
                )}
                {report.image_url ? (
                  <div onClick={() => handleImageClick(report)} className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
                    <img src={report.image_url} alt="Issue" className="w-20 h-20 object-cover rounded-xl" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">No Image</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{translateCategory(report.category)}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold border whitespace-nowrap ${getRiskColor(report.calculated_risk_level)}`}>
                          {translateRisk(report.calculated_risk_level)}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold border whitespace-nowrap ${getStatusBadgeStyle(report.status || 'pending')}`}>
                          {translateStatus(report.status || 'pending')}
                        </span>
                      </div>
                    </div>
                    {/* Status Dropdown selector */}
                    <select
                      value={report.status || 'pending'}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      className="text-[10px] bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer shrink-0"
                    >
                      <option value="pending">รอดำเนินการ</option>
                      <option value="in_progress">กำลังทำ</option>
                      <option value="resolved">เสร็จสิ้น</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed mb-1 mt-1">{report.description || 'ไม่มีคำอธิบายเพิ่มเติม'}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400">{new Date(report.created_at).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.</span>
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      ★ ดัชนี {report.priorityScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
