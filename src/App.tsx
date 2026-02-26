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
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
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
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
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
    </div>
  );
}

