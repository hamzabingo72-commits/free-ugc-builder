/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Settings, Wand2, Sparkles, Upload, Download, Loader2, LayoutTemplate } from 'lucide-react';
import UgcPhotoGenerator from './components/UgcPhotoGenerator';
import LandingPageGenerator from './components/LandingPageGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'photo' | 'landing-page'>('photo');

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-zinc-200 p-4 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <Sparkles size={18} />
        </div>
        <h1 className="font-semibold text-lg tracking-tight">Free UGC Builder</h1>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-zinc-200 flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <h1 className="font-semibold text-lg tracking-tight">Free UGC Builder</h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <button
            onClick={() => setActiveTab('photo')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'photo'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <ImageIcon size={18} />
            UGC Photo
          </button>
          <button
            onClick={() => setActiveTab('landing-page')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'landing-page'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <LayoutTemplate size={18} />
            Landing Page
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'photo' && <UgcPhotoGenerator />}
            {activeTab === 'landing-page' && <LandingPageGenerator />}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-around p-2 z-50 pb-safe">
        <button
          onClick={() => setActiveTab('photo')}
          className={`flex flex-col items-center p-2 rounded-lg min-w-[80px] ${
            activeTab === 'photo' ? 'text-indigo-600' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <ImageIcon size={20} />
          <span className="text-xs mt-1 font-medium">UGC Photo</span>
        </button>
        <button
          onClick={() => setActiveTab('landing-page')}
          className={`flex flex-col items-center p-2 rounded-lg min-w-[80px] ${
            activeTab === 'landing-page' ? 'text-indigo-600' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <LayoutTemplate size={20} />
          <span className="text-xs mt-1 font-medium">Landing Page</span>
        </button>
      </nav>
    </div>
  );
}

