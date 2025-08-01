import React from 'react';
import { FaUsers, FaChartLine } from 'react-icons/fa';

const TeamDisplayCard = ({ teamName }) => {
  return (
    <div className="relative group mb-8">
      <div 
        className="flex items-center bg-black hover:bg-gray-900 rounded-xl px-6 py-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
        style={{ borderRadius: '12px' }}
      >
        <div className="flex items-center space-x-4">
          {/* Modern Gaming Team Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <FaUsers className="w-6 h-6 text-white" />
          </div>
          
          {/* Team Info */}
          <div className="flex flex-col">
            <span className="text-gray-300 text-sm font-medium tracking-wide">CURRENT TEAM</span>
            <span className="text-blue-200 font-bold text-2xl tracking-wide">{teamName}</span>
          </div>
          
          {/* Modern Gaming Stats Icon */}
          <div className="ml-4 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
            <FaChartLine className="w-6 h-6" />
          </div>
        </div>
      </div>
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-all duration-300 pointer-events-none" style={{ borderRadius: '12px' }}></div>
    </div>
  );
};

export default TeamDisplayCard; 