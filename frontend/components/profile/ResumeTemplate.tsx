import React from "react";
import { UserProfile } from "../../services/activity/profile";

interface ResumeTemplateProps {
  profile: UserProfile;
  isEditable?: boolean;
}

export const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ profile, isEditable = false }) => {
  return (
    <div className="bg-[#030014] text-white p-12 max-w-[850px] mx-auto shadow-2xl font-display" id="resume-content">
      {/* Header */}
      <div className="flex items-center gap-8 mb-12 border-b border-white/10 pb-12">
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-emerald-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img
            src={profile.avatar}
            className="size-32 rounded-full border-2 border-primary/20 object-cover relative z-10"
            alt={profile.name}
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase">{profile.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px]">
              <span className="material-symbols-outlined !text-[16px]">work</span>
              {profile.role || profile.systemRole}
            </span>
            <span className="opacity-30">|</span>
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px]">
              <span className="material-symbols-outlined !text-[16px]">location_on</span>
              {profile.location || "Remote / Earth"}
            </span>
            {profile.linkedinUrl && (
              <>
                <span className="opacity-30">|</span>
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px]">
                   LinkedIn: {profile.linkedinUrl}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* About Me */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
            About Me
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm font-medium">
            {profile.bio || "A dedicated developer contributing to the TrackCodex ecosystem. Passionate about building robust systems and delivering high-quality code."}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Tools and Platforms */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 flex items-center gap-3">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
              Tools & Platforms
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "TrackCodex", desc: "Core Intelligence", icon: "hub" },
                { name: "GitHub", desc: "Version Control", icon: "account_tree" },
                { name: "GitLab", desc: "CI/CD Pipeline", icon: "integration_instructions" },
                { name: "Fiverr/Freelance", desc: "External Missions", icon: "work" },
              ].map((tool) => (
                <div key={tool.name} className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                  <span className="material-symbols-outlined !text-[20px] text-slate-400">{tool.icon}</span>
                  <div>
                    <div className="text-[12px] font-bold text-white">{tool.name}</div>
                    <div className="text-[10px] text-slate-500">{tool.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Performance Grades */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-amber-400 mb-6 flex items-center gap-3">
              <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
              TrackCodex Performance
            </h2>
            <div className="space-y-4">
              {[
                { label: "Coding Speed", value: profile.skillScore?.coding ?? 85, color: "bg-primary" },
                { label: "Security Impact", value: profile.skillScore?.security ?? 92, color: "bg-emerald-500" },
                { label: "Collaboration", value: profile.skillScore?.collaboration ?? 78, color: "bg-blue-500" },
                { label: "Architecture", value: profile.skillScore?.architecture ?? 88, color: "bg-amber-500" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>{stat.label}</span>
                    <span>{stat.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} shadow-sm`} 
                      style={{ width: `${stat.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Work Experience / Missions */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-3">
            <span className="size-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span>
            Experience & Missions
          </h2>
          <div className="space-y-8">
            {profile.receivedReviews && profile.receivedReviews.length > 0 ? (
              profile.receivedReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="relative pl-6 border-l border-white/10">
                  <div className="absolute top-0 left-[-4px] size-2 rounded-full bg-blue-400"></div>
                  <div className="flex justify-between items-start mb-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <span>{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{review.jobTitle}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
                <p className="text-slate-500 text-sm">Active participant in the TrackCodex freelance network.</p>
              </div>
            )}
          </div>
        </section>

        {/* Education & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-rose-400 mb-6 flex items-center gap-3">
              <span className="size-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]"></span>
              Achievements
            </h2>
            <div className="flex flex-wrap gap-4">
              {profile.achievements && profile.achievements.length > 0 ? (
                profile.achievements.map((ach) => (
                  <div key={ach.name} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl w-full">
                    <img src={ach.imageUrl} alt={ach.name} className="size-10" />
                    <div>
                      <div className="text-[12px] font-bold text-white">{ach.name}</div>
                      <div className="text-[10px] text-slate-500">Earned x{ach.count} times</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-sm italic">Verified by TrackCodex Network</div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-3">
              <span className="size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span>
              Network Presence
            </h2>
            <div className="space-y-4">
               <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                 <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Reputation</div>
                 <div className="text-2xl font-bold text-white">{profile.communityKarma} Karma</div>
               </div>
               <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                 <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Impact</div>
                 <div className="text-2xl font-bold text-white">{profile.jobsCompleted} Completed</div>
               </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div>Generated by TrackCodex Vault</div>
        <div>Verified Ecosystem Profile</div>
      </div>
    </div>
  );
};
