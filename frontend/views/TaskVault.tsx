import React, { useState } from "react";

/* ───────────────────────────── Create Project Modal ───────────────────────────── */
const iconOptions = [
    "flag", "rocket_launch", "cake", "favorite", "paid", "bolt", "mail", "star",
];

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
    const [projectName, setProjectName] = useState("");
    const [assignee, setAssignee] = useState("You");
    const [endDate, setEndDate] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("rocket_launch");
    const [description, setDescription] = useState("");
    const [progressType, setProgressType] = useState("action_items");
    const [showAssignDropdown, setShowAssignDropdown] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!projectName.trim()) return;
        // In a real app this would call an API
        onClose();
        setProjectName("");
        setDescription("");
        setEndDate("");
        setProgressType("action_items");
        setSelectedIcon("rocket_launch");
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md mx-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl shadow-2xl animate-slide-up overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center size-7 bg-blue-600 rounded-md">
                            <span className="material-symbols-outlined !text-[16px] text-white">check_box</span>
                        </div>
                        <h2 className="text-lg font-bold text-white">Create Project</h2>
                        <span className="size-2 rounded-full bg-[#333]" />
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-[#666] hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined !text-[20px]">close</span>
                    </button>
                </div>

                <div className="px-6 pb-6 space-y-5">
                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-semibold text-red-400 mb-1.5">
                            Project name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g. Launch marketing site"
                            className="w-full bg-[#111] border border-[#2A2A2A] focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                        />
                    </div>

                    {/* Assign + End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#888] mb-1.5">Assign</label>
                            <div className="relative">
                                <button
                                    onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                                    className="w-full flex items-center justify-between bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white hover:border-[#444] transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                            {assignee.charAt(0)}
                                        </div>
                                        <span>{assignee}</span>
                                    </div>
                                    <span className="material-symbols-outlined !text-[18px] text-[#666]">expand_more</span>
                                </button>
                                {showAssignDropdown && (
                                    <div className="absolute z-10 top-full left-0 mt-1 w-full bg-[#111] border border-[#2A2A2A] rounded-xl shadow-xl overflow-hidden">
                                        {["You", "Team Lead", "Developer", "Designer"].map((name) => (
                                            <button
                                                key={name}
                                                onClick={() => { setAssignee(name); setShowAssignDropdown(false); }}
                                                className="w-full px-4 py-2.5 text-sm text-left text-[#ccc] hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#888] mb-1.5">
                                Project end date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    title="Project end date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Icon Chooser */}
                    <div>
                        <label className="block text-sm font-medium text-[#888] mb-2">Choose icon</label>
                        <div className="flex gap-2">
                            {iconOptions.map((icon) => (
                                <button
                                    key={icon}
                                    onClick={() => setSelectedIcon(icon)}
                                    className={`size-10 flex items-center justify-center rounded-xl transition-all ${selectedIcon === icon
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110"
                                        : "bg-[#111] border border-[#2A2A2A] text-[#888] hover:text-white hover:border-[#444]"
                                        }`}
                                >
                                    <span className="material-symbols-outlined !text-[20px]">{icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-[#888] mb-1.5">Project description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Add more detail here to help remember why you created this project"
                            className="w-full bg-[#111] border border-[#2A2A2A] focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Progress Measurement */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            How will you measure progress? <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: "sub_goals", label: "Completing sub-goals" },
                                { value: "action_items", label: "Completing action items" },
                                { value: "tracking", label: "Tracking a number, percent, or dollar amount" },
                            ].map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div
                                        className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${progressType === option.value
                                            ? "border-blue-500 bg-blue-500"
                                            : "border-[#444] group-hover:border-[#666]"
                                            }`}
                                    >
                                        {progressType === option.value && (
                                            <div className="size-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <span className={`text-sm ${progressType === option.value ? "text-white font-semibold" : "text-[#888]"}`}>
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-red-400 mt-2 italic">* This field is required</p>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-medium text-[#888] bg-[#111] border border-[#2A2A2A] hover:bg-white/5 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!projectName.trim()}
                            className="flex-1 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            Next
                            <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ───────────────────────────── Create Task Modal ───────────────────────────── */
interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
    const [taskName, setTaskName] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [collaborators, setCollaborators] = useState<string[]>([
        "team@trackcodex.dev",
        "dev@trackcodex.dev",
    ]);

    if (!isOpen) return null;

    const addCollaborator = () => {
        const trimmed = emailInput.trim();
        if (trimmed && !collaborators.includes(trimmed)) {
            setCollaborators([...collaborators, trimmed]);
            setEmailInput("");
        }
    };

    const removeCollaborator = (email: string) => {
        setCollaborators(collaborators.filter((c) => c !== email));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addCollaborator();
        }
    };

    const handleCreate = () => {
        if (!taskName.trim()) return;
        onClose();
        setTaskName("");
        setEmailInput("");
        setCollaborators(["team@trackcodex.dev", "dev@trackcodex.dev"]);
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md mx-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl shadow-2xl animate-slide-up overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center size-7 bg-blue-600 rounded-md">
                            <span className="material-symbols-outlined !text-[16px] text-white">task</span>
                        </div>
                        <h2 className="text-lg font-bold text-white">Create a Task</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-[#666] hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined !text-[20px]">close</span>
                    </button>
                </div>

                <p className="px-6 text-sm text-[#888] mb-4">
                    Give your task a name and invite others.
                </p>

                <div className="px-6 pb-6 space-y-5">
                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#ccc] mb-1.5">Task name</label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="e.g. Fix login bug"
                            className="w-full bg-[#111] border border-[#2A2A2A] focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                        />
                    </div>

                    {/* Invite Collaborators */}
                    <div>
                        <label className="block text-sm font-medium text-[#ccc] mb-1.5">
                            Invite others to the task <span className="text-[#555]">(optional)</span>
                        </label>
                        <div className="bg-[#111] border border-[#2A2A2A] rounded-xl px-3 py-2 focus-within:border-blue-500 transition-colors">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {collaborators.map((email) => (
                                    <span
                                        key={email}
                                        className="inline-flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#ccc] group"
                                    >
                                        {email.length > 18 ? email.slice(0, 16) + "..." : email}
                                        <button
                                            onClick={() => removeCollaborator(email)}
                                            className="text-[#555] hover:text-red-400 transition-colors"
                                        >
                                            <span className="material-symbols-outlined !text-[14px]">close</span>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter one or more email addresses, separated by a comma or space, and then press Return or Enter."
                                className="w-full bg-transparent text-sm text-white placeholder-[#555] outline-none"
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-medium text-[#888] bg-[#111] border border-[#2A2A2A] hover:bg-white/5 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!taskName.trim()}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                        >
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ───────────────────────────── TaskVault (Main Page) ───────────────────────────── */
const TaskVault = () => {
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showCreateTask, setShowCreateTask] = useState(false);

    const profileChecklist = [
        { label: "Add Your Full Name", desc: "Displayed on tasks, projects, and team pages.", done: true },
        { label: "Upload Your Profile Picture", desc: "Add a friendly photo so your teammates recognize you.", done: false },
        { label: "Set Your Job Title or Role", desc: "Helps your team understand what you do", done: false },
    ];

    const learnArticles = [
        { icon: "calendar_month", title: "Using the Calendar View to Plan Your Week", time: "5 min read" },
        { icon: "assignment", title: "How to Create and Manage Projects", time: "5 min read" },
        { icon: "checklist", title: "How to Mastering Task Prioritization", time: "5 min read" },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-gh-bg font-display">
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

                {/* ── Welcome Header ── */}
                <div>
                    <h1 className="text-2xl font-black text-white mb-1">
                        Welcome to TaskVault! 👋
                    </h1>
                    <p className="text-sm text-[#888]">
                        You're just a few steps away from mastering your workflow.
                    </p>
                </div>

                {/* ── Profile Setup Card ── */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 card-hover-glow">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left — Progress Circle */}
                        <div className="flex flex-col items-center gap-3 min-w-[160px]">
                            <div className="relative size-28">
                                {/* Background circle */}
                                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1A1A1A" strokeWidth="8" />
                                    <circle
                                        cx="50" cy="50" r="42" fill="none" stroke="#3b82f6" strokeWidth="8"
                                        strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42 * 0.4} ${2 * Math.PI * 42 * 0.6}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="size-16 rounded-full bg-[#111] border border-[#2A2A2A] flex items-center justify-center">
                                        <span className="material-symbols-outlined !text-[28px] text-[#555]">person</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-white">40%</p>
                                <p className="text-sm font-semibold text-[#888] mt-0.5">Let's Set Up Your Profile</p>
                                <p className="text-xs text-[#555]">Help your team recognize you!</p>
                            </div>
                            <button
                                className="mt-1 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#111] border border-[#2A2A2A] hover:bg-white/5 hover:border-[#444] transition-all flex items-center gap-1.5"
                            >
                                Complete Profile
                                <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
                            </button>
                        </div>

                        {/* Right — Checklist */}
                        <div className="flex-1 space-y-4">
                            {profileChecklist.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 group">
                                    <div className={`mt-0.5 size-6 rounded-full flex items-center justify-center shrink-0 transition-all ${item.done
                                        ? "bg-blue-600 text-white"
                                        : "border-2 border-[#333] text-transparent group-hover:border-[#555]"
                                        }`}>
                                        {item.done && <span className="material-symbols-outlined !text-[16px]">check</span>}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold ${item.done ? "text-white" : "text-[#888]"}`}>
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-[#555]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Action Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Create Project Card */}
                    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 card-hover-glow group cursor-pointer"
                        onClick={() => setShowCreateProject(true)}>
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 flex items-end gap-1">
                                <div className="w-8 h-10 bg-[#222] rounded-md border border-[#333]" />
                                <div className="w-8 h-12 bg-[#1A1A1A] rounded-md border border-[#2A2A2A]" />
                                <div className="w-8 h-8 bg-[#111] rounded-md border border-[#222]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-white mb-1">Create Your First Project</h3>
                                <p className="text-xs text-[#666] mb-4 leading-relaxed">
                                    Start by organizing your tasks into a project — big or small!
                                </p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowCreateProject(true); }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#111] border border-[#2A2A2A] hover:bg-white/5 hover:border-[#444] transition-all flex items-center gap-1.5 group-hover:border-blue-500/50"
                                >
                                    Create Project
                                    <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add Tasks Card */}
                    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 card-hover-glow group cursor-pointer"
                        onClick={() => setShowCreateTask(true)}>
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="size-4 rounded bg-blue-600/30 border border-blue-500/40" />
                                    <div className="h-2 w-16 bg-[#222] rounded-full" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-4 rounded bg-[#222] border border-[#333]" />
                                    <div className="h-2 w-12 bg-[#1A1A1A] rounded-full" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-4 rounded bg-[#222] border border-[#333]" />
                                    <div className="h-2 w-20 bg-[#1A1A1A] rounded-full" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-white mb-1">Add Your First Tasks</h3>
                                <p className="text-xs text-[#666] mb-4 leading-relaxed">
                                    Break your project down into actionable steps by steps work
                                </p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowCreateTask(true); }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#111] border border-[#2A2A2A] hover:bg-white/5 hover:border-[#444] transition-all flex items-center gap-1.5 group-hover:border-blue-500/50"
                                >
                                    Add Tasks
                                    <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Learn Section ── */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined !text-[20px] text-[#888]">school</span>
                        <h2 className="text-base font-bold text-white">Learn</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {learnArticles.map((article, idx) => (
                            <div
                                key={idx}
                                className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden card-hover-glow group cursor-pointer"
                            >
                                {/* Illustration Area */}
                                <div className="h-32 bg-gradient-to-br from-[#111] to-[#0A0A0A] flex items-center justify-center border-b border-[#1A1A1A] relative overflow-hidden">
                                    {/* Decorative grid */}
                                    <div className="absolute inset-0 opacity-10 bg-[length:20px_20px] bg-[linear-gradient(#333_1px,transparent_1px),linear-gradient(90deg,#333_1px,transparent_1px)]" />
                                    <span className="material-symbols-outlined !text-[48px] text-[#333] group-hover:text-blue-500/30 transition-colors relative z-10">
                                        {article.icon}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-[#555]">
                                        <span className="material-symbols-outlined !text-[14px]">schedule</span>
                                        {article.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ── Modals ── */}
            <CreateProjectModal isOpen={showCreateProject} onClose={() => setShowCreateProject(false)} />
            <CreateTaskModal isOpen={showCreateTask} onClose={() => setShowCreateTask(false)} />
        </div>
    );
};

export default TaskVault;
