

// export default SummaryDetail;
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
 
import { useDeleteSummaryMutation, useRePromptSummaryMutation } from '../../redux/features/summary/summaryApi';
import Spinner from '../ui/Spinner';
import { clearSelectedSummary, setSelectedSummary } from '../../redux/features/summary/summarySlice';

const SummaryDetail = () => {
    const dispatch = useDispatch();
    const summary = useSelector(state => state.summary.selectedSummaryDetails);
    
    // 1. Get the logged-in user's data from the Redux state.
    const { user: loggedInUser } = useSelector(state => state.auth);
    
    // Note: It's good practice to use consistent hook names, e.g., useRepromptSummaryMutation
    const [deleteSummary, { isLoading: isDeleting }] = useDeleteSummaryMutation();
    const [repromptSummary, { isLoading: isReprompting }] = useRePromptSummaryMutation();
    
    const [isCopied, setIsCopied] = useState(false);
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (summary) {
            setValue('prompt', summary.prompt);
        }
    }, [summary, setValue]);

    if (!summary) {
        return <div className="p-6 text-center text-gray-400">Select a summary from the history or create a new one.</div>;
    }

    // --- PERMISSION LOGIC ---
    // 2. Define clear boolean constants for permissions.
    // A user can delete if they are an admin, an editor, OR if they are the owner of the summary.
    const canDelete = 
        loggedInUser && 
        (
            loggedInUser.role === 'admin' ||
            loggedInUser.role === 'editor' ||
            summary.user === loggedInUser._id // Check for ownership
        );

    // A user can re-prompt under the same conditions. A 'reviewer' cannot.
    const canReprompt = canDelete; // In this case, the logic is the same.

    const onReprompt = async (data) => {
        try {
            const result = await repromptSummary({ id: summary._id, prompt: data.prompt }).unwrap();
            const newSummaryData = result.data.summary;
            dispatch(setSelectedSummary(newSummaryData));
        } catch (err) {
            console.error("Re-prompt failed:", err);
            alert(err.data?.message || 'Failed to re-prompt.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this summary?')) {
            try {
                await deleteSummary(summary._id).unwrap();
                dispatch(clearSelectedSummary());
            } catch (err) {
                 alert(err.data?.message || 'Failed to delete.');
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(summary.summarizedContent);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Summary Details</h2>
                {/* 3. Conditionally render the Delete button based on permissions */}
                {canDelete && (
                    <button onClick={handleDelete} disabled={isDeleting} className="text-sm font-semibold text-red-500 hover:text-red-400 disabled:opacity-50">
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                )}
            </div>

            {/* 4. Conditionally render either the editable form or a static view */}
            {canReprompt ? (
                // --- VIEW FOR USERS WITH EDIT PERMISSION ---
                <form onSubmit={handleSubmit(onReprompt)} className="flex-1 flex flex-col space-y-6">
                    <div className='flex-1 flex flex-col'>
                        <label htmlFor='prompt' className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Original Prompt (Editable)</label>
                        <textarea
                            id='prompt'
                            {...register('prompt')}
                            rows="8"
                            className="w-full flex-1 p-3 bg-slate-900 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                        <div className="mt-2 flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-slate-500 transition-colors flex items-center justify-center min-w-[210px]"
                                disabled={isReprompting}
                            >
                                {isReprompting ? (
                                    <><Spinner /> <span className="ml-2">Generating...</span></>
                                ) : (
                                    'Re-prompt & Use 1 Credit'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                // --- STATIC VIEW FOR USERS WITHOUT EDIT PERMISSION (e.g., Reviewers) ---
                <div className='flex-1 flex flex-col'>
                     <label className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Original Prompt</label>
                     <div className="w-full flex-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-300 whitespace-pre-wrap">
                        {summary.prompt}
                     </div>
                </div>
            )}

            {/* The AI summary box is always visible, but we add the Copy button */}
            <div className='flex-1 flex flex-col'>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">AI Generated Summary</label>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${isCopied ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-300 hover:bg-slate-500'}`}
                    >
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="w-full flex-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 whitespace-pre-wrap">
                    {summary.summarizedContent}
                </div>
            </div>
        </div>
    );
};

export default SummaryDetail;