import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CandidateCard } from './CandidateCard';

export const KanbanColumn = ({ id, title, applications }: { id: string; title: string; applications: any[] }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[280px] bg-[#000000] border border-[#1A1A1A] rounded-xl flex flex-col h-full max-h-full">
            <div className="p-3 border-b border-[#1A1A1A] flex items-center justify-between sticky top-0 bg-[#000000] z-10 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
                    <span className="bg-[#0A0A0A] text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#1A1A1A]">{applications.length}</span>
                </div>
                <button className="text-slate-600 hover:text-white transition-colors"><span className="material-symbols-outlined !text-[16px]">add</span></button>
            </div>

            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                {applications.map(app => (
                    <CandidateCard key={app.id} application={app} />
                ))}
                {applications.length === 0 && (
                    <div className="h-24 flex items-center justify-center border border-dashed border-[#1A1A1A] rounded-lg m-1">
                        <span className="text-[10px] text-slate-600">Drop here</span>
                    </div>
                )}
            </div>
        </div>
    );
};
