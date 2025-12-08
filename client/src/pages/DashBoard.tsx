import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authData';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api/v1';

interface Note {
    _id: string;
    title: string;
    content: string;
    tags: string[];
}

const DashBoard = () => {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    
    // --- STATE ---
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    // UI State
    const [showForm, setShowForm] = useState(false); // NEW: Controls form visibility

    // Form Inputs
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]); 
    const [tagInput, setTagInput] = useState('');   
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch Notes
    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }
        fetchNotes();
    }, [token]);

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/notes`,{
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(response.data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                logout();
            }
        }
    };

    // --- TAG FUNCTIONS ---
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // --- FORM SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!title || !content) {
            setError("Title and Content are required");
            return;
        }

        try {
            const payload = { title, content, tags }; 

            if (editingId) {
                // UPDATE
                const response = await axios.put(`${API_BASE_URL}/notes/update/${editingId}`, 
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setNotes(notes.map(note => 
                    note._id === editingId ? response.data : note
                ));
            } else {
                // CREATE
                const response = await axios.post(`${API_BASE_URL}/notes`, 
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setNotes([...notes, response.data]);
            }
            // Reset and Close
            resetForm();
        } catch (err) {
            setError("Failed to save note");
            console.error(err);
        }
    };

    // --- DELETE ---
    const handleDelete = async (id: string) => {
        if(!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/notes/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(notes.filter(note => note._id !== id));
            // If we were editing the deleted note, close the form
            if (editingId === id) resetForm();
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    // --- HELPER FUNCTIONS ---
    const startEditing = (note: Note) => {
        setEditingId(note._id);
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags || []); 
        setTagInput('');
        setShowForm(true); // Auto-open form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setTags([]);
        setTagInput('');
        setError(null);
        setShowForm(false); // Auto-close form
    };

    // --- FILTER LOGIC ---
    const filteredNotes = notes.filter(note => {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesTags = note.tags?.some(tag => tag.toLowerCase().includes(query));
        return matchesTitle || matchesTags;
    });

    return (
        <div className="min-h-screen bg-[#111827] text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header & Logout */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#E5E7EB]">
                        Welcome, {user?.name}
                    </h1>
                    <button onClick={logout} className="text-red-400 hover:text-red-300">
                        Logout
                    </button>
                </div>

                {/* SEARCH BAR & CREATE BUTTON */}
                <div className="flex gap-4 mb-6">
                    <input 
                        type="text"
                        placeholder="Search by title or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-[#1F2937] text-[#E5E7EB] p-3 rounded-lg border border-transparent focus:border-[#4B5563] focus:outline-none"
                    />
                    
                    {/* TOGGLE BUTTON */}
                    <button 
                        onClick={() => {
                            if(showForm) {
                                resetForm(); // If closing, reset
                            } else {
                                setShowForm(true); // If opening, just show
                            }
                        }}
                        className={`font-bold py-2 px-6 rounded transition whitespace-nowrap ${
                            showForm 
                            ? "bg-gray-600 hover:bg-gray-500" 
                            : "bg-[#2563EB] hover:bg-[#3B82F6]"
                        }`}
                    >
                        {showForm ? "Close X" : "+ Create Note"}
                    </button>
                </div>

                {/* NOTE FORM (Conditionally Rendered) */}
                {showForm && (
                    <div className="bg-[#1F2937] p-6 rounded-lg mb-8 border border-[#4B5563] shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl mb-4 text-[#E5E7EB]">
                            {editingId ? "Edit Note" : "Create New Note"}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-[#111827] p-2 rounded text-white border border-[#4B5563] focus:outline-none focus:border-[#E5E7EB]"
                            />
                            <textarea
                                placeholder="Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="bg-[#111827] p-2 rounded text-white border border-[#4B5563] h-24 focus:outline-none focus:border-[#E5E7EB]"
                            />

                            {/* TAG INPUT AREA */}
                            <div className="flex flex-col gap-2">
                                <input 
                                    type="text"
                                    placeholder="Type tag and press Enter"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="bg-[#111827] p-2 rounded text-white border border-[#4B5563] text-sm focus:outline-none"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="bg-[#4B5563] text-[#111827] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            #{tag}
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-red-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            
                            <div className="flex gap-3 mt-2">
                                <button 
                                    type="submit" 
                                    className={`font-bold py-2 px-6 rounded transition shadow-md ${
                                        editingId 
                                        ? "bg-yellow-600 hover:bg-yellow-500 text-white" 
                                        : "bg-[#2563EB] hover:bg-[#3B82F6] text-white"
                                    }`}
                                >
                                    {editingId ? "Update Note" : "Save Note"}
                                </button>
                                <button 
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* NOTES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredNotes.map((note) => (
                        <div key={note._id} className="bg-[#1F2937] p-5 rounded-lg relative group border border-transparent hover:border-[#4B5563] transition shadow-md">
                            <h3 className="font-bold text-xl text-[#E5E7EB] mb-2 pr-16 break-words">{note.title}</h3>
                            <p className="text-gray-300 whitespace-pre-wrap mb-4 text-sm break-words">{note.content}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                                {note.tags?.map((tag, i) => (
                                    <span key={i} className="text-[#4B5563] text-xs border border-[#4B5563] px-2 py-0.5 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button 
                                    onClick={() => startEditing(note)}
                                    className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(note._id)}
                                    className="text-red-400 hover:text-red-300 text-sm font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {filteredNotes.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            {searchQuery ? "No matching notes found." : "No notes yet. Click 'Create Note' to start!"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;