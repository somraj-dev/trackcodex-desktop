import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../services/activity/profile';

import { Community } from '../../services/social/socialService';

interface CommunityLeftSidebarProps {
    user: UserProfile | null;
    communities: Community[];
    onStartCommunity: () => void;
    onNavigateHome: () => void;
    onManageCommunities: () => void;
}

const CommunityLeftSidebar: React.FC<CommunityLeftSidebarProps> = ({
    user,
    communities,
    onStartCommunity,
    onNavigateHome,
    onManageCommunities
}) => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [recentCommunities] = useState<Community[]>([]);

    // Manage local star state on top of live communities
    const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

    const toggleStar = (id: string, section: 'recent' | 'my') => {
        if (section === 'my') {
            setStarredIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        }
    };

    const navItems = [
        { label: 'Home', icon: 'home', onClick: onNavigateHome },
        { label: 'Popular', icon: 'trending_up', onClick: () => { } },
        { label: 'News', icon: 'newspaper', onClick: () => { } },
        { label: 'Explore', icon: 'explore', onClick: () => { } },
    ];

    return (
        <div
            className={`h-full bg-[#030303] border-r border-[#1A1A1A] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col shrink-0 overflow-hidden ${isCollapsed ? 'w-[64px]' : 'w-[260px]'
                }`}
        >
            {/* Header & Toggle */}
            <div className="h-[72px] p-4 flex items-center justify-between border-b border-[#1A1A1A] shrink-0">
                <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-[140px] opacity-100'
                    }`}>
                    <div className="size-8 shrink-0 rounded-lg bg-[#3B66ED] flex items-center justify-center text-white font-black text-xl">T</div>
                    <span className="font-bold text-white tracking-tight">TrackCodex</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="size-8 shrink-0 rounded-full border border-[#333333] hover:bg-[#1A1A1A] flex items-center justify-center text-[#A1A1AA] transition-colors"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span className="material-symbols-outlined !text-[18px]">menu</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col py-4">
                {/* Main Nav */}
                <div className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className={`w-full flex items-center rounded-lg hover:bg-[#1A1A1B] text-[#D7DADC] transition-all duration-300 overflow-hidden ${isCollapsed ? 'justify-center h-10 px-0' : 'px-3 gap-3 h-10'
                                }`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <span className="material-symbols-outlined shrink-0 !text-[22px] group-hover:text-white transition-colors">{item.icon}</span>
                            <span className={`text-[14px] font-medium group-hover:text-white text-left overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                                }`}>{item.label}</span>
                        </button>
                    ))}

                    <button
                        onClick={onStartCommunity}
                        className={`w-full flex items-center rounded-lg hover:bg-[#1A1A1B] text-[#D7DADC] transition-all duration-300 overflow-hidden ${isCollapsed ? 'justify-center h-10 px-0' : 'px-3 gap-3 h-10'
                            }`}
                        title={isCollapsed ? "Start a community" : undefined}
                    >
                        <span className="material-symbols-outlined shrink-0 !text-[22px] group-hover:text-white">add</span>
                        <span className={`text-[14px] font-medium group-hover:text-white text-left overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                            }`}>Start a community</span>
                    </button>
                </div>

                {/* Dynamic Sections - Render Recent and Communities always, just hide labels and adapt layout when collapsed */}
                <div className="mt-6 flex flex-col">
                    {/* Recent Section */}
                    {recentCommunities.length > 0 && (
                        <div className="space-y-1 mb-4">
                            <div className={`flex items-center justify-between overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'h-0 opacity-0 mb-0 pointer-events-none' : 'px-6 mb-2 opacity-100 h-4'
                                }`}>
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#575757]">Recent</span>
                                <span className="material-symbols-outlined text-[16px] text-[#575757]">expand_more</span>
                            </div>
                            <div className="px-3 space-y-1">
                                {recentCommunities.map(community => (
                                    <div key={community.id} className={`w-full flex items-center rounded-lg hover:bg-[#1A1A1B] cursor-pointer group transition-all duration-300 overflow-hidden ${isCollapsed ? 'justify-center h-10 px-0' : 'px-3 gap-3 h-10'
                                        }`} title={isCollapsed ? community.name : undefined}>
                                        <img src={community.avatar} className="size-6 shrink-0 rounded-full object-cover" alt="" />
                                        <span className={`text-[14px] text-[#D7DADC] truncate transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                                            }`}>{community.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Communities Section */}
                    <div className="space-y-1 mb-4">
                        <div className={`flex items-center justify-between overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'h-0 opacity-0 mb-0 pointer-events-none' : 'px-6 mb-2 opacity-100 h-4'
                            }`}>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#575757]">Communities</span>
                            <span className="material-symbols-outlined text-[16px] text-[#575757]">expand_more</span>
                        </div>
                        <div className="px-3 space-y-1">
                            <div
                                onClick={onManageCommunities}
                                className={`w-full flex items-center rounded-lg hover:bg-[#1A1A1B] cursor-pointer group transition-all duration-300 overflow-hidden ${isCollapsed ? 'justify-center h-10 px-0' : 'px-3 gap-3 h-10'
                                    }`}
                                title={isCollapsed ? "Manage Communities" : undefined}
                            >
                                <span className="material-symbols-outlined shrink-0 !text-[20px] text-[#D7DADC]">settings</span>
                                <span className={`text-[14px] text-[#D7DADC] transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                                    }`}>Manage Communities</span>
                            </div>

                            {communities.map(community => (
                                <div
                                    key={community.id}
                                    onClick={() => navigate(`/community/${community.slug}`)}
                                    className={`w-full flex items-center rounded-lg hover:bg-[#1A1A1B] cursor-pointer group transition-all duration-300 overflow-hidden ${isCollapsed ? 'justify-center h-10 px-0 relative' : 'px-3 gap-3 h-10 justify-between'
                                        }`} title={isCollapsed ? community.name : undefined}>
                                    <div className="flex items-center gap-3 overflow-hidden h-full flex-1">
                                        <img src={community.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}`} className="size-6 shrink-0 rounded-full object-cover" alt="" />
                                        <span className={`text-[14px] text-[#D7DADC] truncate transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
                                            }`}>{community.name}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStar(community.id, 'my');
                                        }}
                                        className={`material-symbols-outlined shrink-0 !text-[18px] transition-all duration-300 ${starredIds.has(community.id) ? 'text-yellow-500 filled' : 'text-[#575757] group-hover:text-[#A1A1AA]'
                                            } ${isCollapsed ? 'max-w-0 opacity-0 overflow-hidden pointer-events-none w-0 h-0 m-0' : 'max-w-[20px] opacity-100'}`}
                                    >
                                        star
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className={`p-4 border-t border-[#1A1A1A] transition-all duration-300 shrink-0 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {user ? (
                    <div className={`flex items-center rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${isCollapsed ? 'justify-center h-[52px] bg-transparent' : 'px-2 py-2 hover:bg-[#1A1A1B] gap-3 h-[60px]'
                        }`} title={isCollapsed ? user.name : undefined}>
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}`}
                            className="size-[34px] shrink-0 rounded-full border border-[#343536] object-cover"
                            alt=""
                        />
                        <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100 flex-1'
                            }`}>
                            <p className="text-[14px] font-bold text-white truncate w-full leading-tight">{user.name}</p>
                            <p className="text-[12px] text-[#A1A1AA] truncate w-full font-medium leading-tight">@{user.username}</p>
                        </div>
                    </div>
                ) : (
                    <div className={`size-[34px] rounded-full bg-[#1A1A1A] animate-pulse ${isCollapsed ? 'mx-auto' : ''}`} />
                )}
            </div>
        </div>
    );
};

export default CommunityLeftSidebar;
