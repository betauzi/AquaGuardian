import React from 'react';
import { ArrowRight, Activity, Shield, Users, Droplet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <div className="relative pt-8 pb-12 px-6 flex flex-col items-center text-center">
        <div className="bg-blue-600 p-4 rounded-3xl mb-6 shadow-lg shadow-blue-500/40">
          <Droplet className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 mb-4">
          <span className="block">ปกป้องชุมชนด้วย</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            AquaGuardian AI
          </span>
        </h1>
        <p className="mt-2 text-base text-slate-500 max-w-xs mx-auto mb-8">
          แพลตฟอร์มแจ้งเตือนและวิเคราะห์ปัญหาน้ำท่วม ท่อตัน ด้วยเทคโนโลยี AI
        </p>
        
        <button 
          onClick={() => navigate('/upload')}
          className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-transform transform hover:scale-105"
        >
          แจ้งปัญหาเดี๋ยวนี้ <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* Features Section */}
      <div className="px-6 pb-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">ทำไมต้องใช้เรา?</h2>
        
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-2xl flex-shrink-0">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">AI วิเคราะห์แม่นยำ</h3>
            <p className="mt-1 text-sm text-slate-500">ประเมินความเสี่ยงจากภาพถ่ายของคุณได้ทันทีแบบเรียลไทม์</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="bg-cyan-50 p-3 rounded-2xl flex-shrink-0">
            <Shield className="h-6 w-6 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">แจ้งเตือนรวดเร็ว</h3>
            <p className="mt-1 text-sm text-slate-500">ส่งต่อข้อมูลให้หน่วยงานที่เกี่ยวข้องเพื่อแก้ไขทันท่วงที</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="bg-indigo-50 p-3 rounded-2xl flex-shrink-0">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">พลังชุมชน</h3>
            <p className="mt-1 text-sm text-slate-500">ร่วมกันเป็นหูเป็นตาเพื่อชุมชนที่ปลอดภัยจากน้ำท่วม</p>
          </div>
        </div>
      </div>
    </div>
  );
}
