import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileData, CodeIssue } from '@/types/audit';
import { MOCK_FILE_TREE, REFACTORED_CODE } from '@utils/auditData';

type Tab = 'issues' | 'performance' | 'preview' | 'refactored';

export function CodeAuditor() {
    const [selectedFile, setSelectedFile] = useState<FileData>(MOCK_FILE_TREE[0]);
    const [activeTab, setActiveTab] = useState<Tab>('issues');
    const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null);
    const [hoveredLine, setHoveredLine] = useState<number | null>(null);
    const [isRefactoredApplied, setIsRefactoredApplied] = useState(false);
    const codeContainerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<{ [key: number]: HTMLDivElement }>({});

    // Scroll to line when issue is selected
    useEffect(() => {
        if (selectedIssue && lineRefs.current[selectedIssue.line]) {
            lineRefs.current[selectedIssue.line].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [selectedIssue]);

    // Reset selected issue and refactored state when file changes
    useEffect(() => {
        setSelectedIssue(null);
        setIsRefactoredApplied(false);
    }, [selectedFile]);

    const handleApplyChanges = () => {
        // Update the selected file with refactored code
        const updatedFile: FileData = {
            ...selectedFile,
            content: REFACTORED_CODE,
            issues: [] // Clear all issues since they're fixed
        };
        setSelectedFile(updatedFile);
        setIsRefactoredApplied(true);
        setSelectedIssue(null);
        setActiveTab('issues'); // Switch to issues tab to show "no issues"
    };

    const getSeverityColor = (severity: CodeIssue['severity']) => {
        switch (severity) {
            case 'critical':
                return 'text-cyber-red border-cyber-red';
            case 'warning':
                return 'text-cyber-yellow border-cyber-yellow';
            case 'info':
                return 'text-cyber-cyan border-cyber-cyan';
        }
    };

    const getSeverityBg = (severity: CodeIssue['severity']) => {
        switch (severity) {
            case 'critical':
                return 'bg-cyber-red bg-opacity-10';
            case 'warning':
                return 'bg-cyber-yellow bg-opacity-10';
            case 'info':
                return 'bg-cyber-cyan bg-opacity-10';
        }
    };

    const renderLineWithHighlight = (line: string, lineNum: number) => {
        const hasIssue = selectedFile.issues.find(issue => issue.line === lineNum);
        const isHovered = hoveredLine === lineNum;

        return (
            <div
                key={lineNum}
                ref={(el) => {
                    if (el) lineRefs.current[lineNum] = el;
                }}
                className={`flex hover:bg-white hover:bg-opacity-5 ${hasIssue ? getSeverityBg(hasIssue.severity) : ''}`}
                onMouseEnter={() => setHoveredLine(lineNum)}
                onMouseLeave={() => setHoveredLine(null)}
                onClick={() => hasIssue && setSelectedIssue(hasIssue)}
            >
                <div className="w-12 text-right pr-4 text-terminal-gray-600 select-none flex-shrink-0">
                    {lineNum}
                </div>
                <div className="flex-1 pr-4 relative">
                    {hasIssue && (
                        <div className={`absolute left-0 w-1 h-full ${hasIssue.severity === 'critical' ? 'bg-cyber-red' : hasIssue.severity === 'warning' ? 'bg-cyber-yellow' : 'bg-cyber-cyan'}`} />
                    )}
                    <pre className="font-mono text-sm pl-2">
                        <code>{line}</code>
                    </pre>
                    {isHovered && hasIssue && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-8 top-full mt-1 glass-strong rounded-lg p-3 z-10 max-w-md"
                        >
                            <div className={`text-xs font-bold mb-1 ${getSeverityColor(hasIssue.severity).split(' ')[0]}`}>
                                {hasIssue.title}
                            </div>
                            <div className="text-xs text-terminal-gray-300">
                                {hasIssue.description}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-terminal-dark p-4 overflow-hidden gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gradient mb-1">🔍 Code Auditor</h2>
                    <p className="text-terminal-gray-400 text-sm">
                        AI-powered code review and optimization tool
                    </p>
                </div>

                <div className="glass rounded-lg px-4 py-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyber-red" />
                        <span className="text-xs text-terminal-gray-400">
                            {selectedFile.issues.filter(i => i.severity === 'critical').length} Critical
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyber-yellow" />
                        <span className="text-xs text-terminal-gray-400">
                            {selectedFile.issues.filter(i => i.severity === 'warning').length} Warnings
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyber-cyan" />
                        <span className="text-xs text-terminal-gray-400">
                            {selectedFile.issues.filter(i => i.severity === 'info').length} Info
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
                {/* File Explorer */}
                <div className="col-span-2 glass rounded-lg p-4 overflow-auto">
                    <h3 className="text-xs font-bold text-terminal-gray-400 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        PROJECT STRUCTURE
                    </h3>

                    <div className="space-y-1">
                        {MOCK_FILE_TREE.map((file) => (
                            <motion.button
                                key={file.path}
                                onClick={() => setSelectedFile(file)}
                                whileHover={{ x: 4 }}
                                className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${selectedFile.path === file.path
                                    ? 'bg-cyber-cyan bg-opacity-20 text-cyber-cyan border-l-2 border-cyber-cyan'
                                    : 'text-terminal-gray-300 hover:bg-white hover:bg-opacity-5'
                                    }`}
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="truncate">{file.name}</span>
                                {file.issues.length > 0 && (
                                    <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-cyber-red text-white text-xs flex items-center justify-center">
                                        {file.issues.length}
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Code Editor */}
                <div className="col-span-7 flex flex-col gap-2">
                    {/* File tabs */}
                    <div className="glass rounded-lg px-4 py-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="text-sm font-mono text-white">{selectedFile.name}</span>
                        {isRefactoredApplied && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 rounded-full text-xs bg-cyber-green bg-opacity-20 text-cyber-green border border-cyber-green"
                            >
                                Refactored
                            </motion.span>
                        )}
                        <span className="ml-auto text-xs text-terminal-gray-500">{selectedFile.language}</span>
                        {isRefactoredApplied && (
                            <button
                                onClick={() => {
                                    setSelectedFile(MOCK_FILE_TREE[0]);
                                    setIsRefactoredApplied(false);
                                }}
                                className="ml-2 px-2 py-1 text-xs rounded bg-terminal-gray-700 hover:bg-terminal-gray-600 text-terminal-gray-300 hover:text-white transition-all"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Code view */}
                    <div className="flex-1 glass rounded-lg overflow-hidden">
                        <div
                            ref={codeContainerRef}
                            className="h-full overflow-y-auto overflow-x-auto bg-terminal-darker"
                            style={{ maxHeight: 'calc(100vh - 300px)' }}
                        >
                            <div className="min-w-max">
                                {selectedFile.content.split('\n').map((line, idx) =>
                                    renderLineWithHighlight(line, idx + 1)
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick fix bar */}
                    {selectedIssue && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-strong rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className={`text-sm font-bold mb-1 ${getSeverityColor(selectedIssue.severity).split(' ')[0]}`}>
                                        {selectedIssue.title}
                                    </div>
                                    <div className="text-xs text-terminal-gray-400 mb-2">
                                        {selectedIssue.suggestion}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setActiveTab('refactored');
                                            }}
                                            className="btn-primary text-xs px-3 py-1"
                                        >
                                            Apply Fix
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveTab('issues');
                                            }}
                                            className="btn-ghost text-xs px-3 py-1"
                                        >
                                            Show More
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedIssue(null)}
                                    className="text-terminal-gray-500 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Inspection Panel */}
                <div className="col-span-3 glass rounded-lg overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-terminal-gray-700">
                        {(['issues', 'performance', 'preview', 'refactored'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-4 py-3 text-xs font-medium capitalize transition-all ${activeTab === tab
                                    ? 'text-cyber-cyan border-b-2 border-cyber-cyan bg-cyber-cyan bg-opacity-5'
                                    : 'text-terminal-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-auto scrollbar-hide p-4">
                        <AnimatePresence mode="wait">
                            {activeTab === 'issues' && (
                                <motion.div
                                    key="issues"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-2"
                                >
                                    {selectedFile.issues.length > 0 ? (
                                        selectedFile.issues.map((issue) => (
                                            <motion.div
                                                key={issue.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => setSelectedIssue(issue)}
                                                className={`p-3 rounded-lg cursor-pointer transition-all border ${selectedIssue?.id === issue.id
                                                    ? `${getSeverityColor(issue.severity)} ${getSeverityBg(issue.severity)} border-opacity-50`
                                                    : 'border-terminal-gray-700 hover:border-cyber-cyan'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2 mb-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${issue.severity === 'critical' ? 'bg-cyber-red' :
                                                        issue.severity === 'warning' ? 'bg-cyber-yellow' :
                                                            'bg-cyber-cyan'
                                                        }`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-bold text-white mb-1 truncate">
                                                            {issue.title}
                                                        </div>
                                                        <div className="text-xs text-terminal-gray-400 mb-2">
                                                            {issue.description}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-terminal-gray-500">
                                                            <span className="px-2 py-0.5 rounded bg-terminal-gray-800">
                                                                {issue.category}
                                                            </span>
                                                            <span>Line {issue.line}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            className="text-center py-8"
                                        >
                                            <div className="text-5xl mb-3">🎉</div>
                                            <div className="text-lg font-bold text-cyber-green mb-2">
                                                {isRefactoredApplied ? 'Changes Applied!' : 'No Issues Found'}
                                            </div>
                                            <div className="text-sm text-terminal-gray-400">
                                                {isRefactoredApplied
                                                    ? 'All issues have been fixed with the refactored code'
                                                    : 'This file has no code quality issues'}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'performance' && (
                                <motion.div
                                    key="performance"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {selectedFile.issues.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="glass rounded-lg p-4">
                                                <div className="text-xs text-terminal-gray-400 mb-2">Performance Score</div>
                                                <div className="flex items-end gap-2">
                                                    <div className={`text-4xl font-bold ${selectedFile.issues.filter(i => i.severity === 'critical').length > 0
                                                            ? 'text-cyber-red'
                                                            : selectedFile.issues.filter(i => i.severity === 'warning').length > 0
                                                                ? 'text-cyber-yellow'
                                                                : 'text-cyber-cyan'
                                                        }`}>
                                                        {selectedFile.issues.filter(i => i.severity === 'critical').length > 0 ? '35' : '65'}
                                                    </div>
                                                    <div className="text-sm text-terminal-gray-500 mb-1">/100</div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-xs font-bold text-terminal-gray-400 mb-2">Issues Found</div>
                                                <div className="space-y-2">
                                                    {selectedFile.issues.slice(0, 3).map((issue) => (
                                                        <div key={issue.id} className="glass rounded-lg p-3">
                                                            <div className="text-xs text-white mb-1">{issue.title}</div>
                                                            <div className="text-xs text-terminal-gray-500">{issue.category}</div>
                                                        </div>
                                                    ))}
                                                    {selectedFile.issues.length > 3 && (
                                                        <div className="text-xs text-terminal-gray-500 text-center pt-2">
                                                            +{selectedFile.issues.length - 3} more issues
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-3">✨</div>
                                            <div className="text-sm text-cyber-green mb-2">No Issues Found</div>
                                            <div className="text-xs text-terminal-gray-500">This file looks great!</div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'refactored' && (
                                <motion.div
                                    key="refactored"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="h-full"
                                >
                                    {selectedFile.name === 'WalletPage.tsx' ? (
                                        <>
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs text-terminal-gray-400">Optimized Code</div>
                                                    {isRefactoredApplied && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="flex items-center gap-1 text-xs text-cyber-green"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Applied
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleApplyChanges}
                                                    disabled={isRefactoredApplied}
                                                    className={`text-xs px-3 py-1 transition-all ${isRefactoredApplied
                                                            ? 'bg-cyber-green bg-opacity-20 text-cyber-green border border-cyber-green cursor-not-allowed'
                                                            : 'btn-primary hover:scale-105'
                                                        }`}
                                                >
                                                    {isRefactoredApplied ? '✓ Applied' : 'Apply Changes'}
                                                </button>
                                            </div>
                                            <div className="glass rounded-lg p-3 overflow-auto h-[calc(100%-3rem)]">
                                                <pre className="text-xs font-mono text-terminal-gray-300 whitespace-pre-wrap">
                                                    {REFACTORED_CODE}
                                                </pre>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-3">✅</div>
                                            <div className="text-sm text-cyber-green mb-2">No Refactoring Needed</div>
                                            <div className="text-xs text-terminal-gray-500">This file has no issues</div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'preview' && (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {selectedFile.name === 'WalletPage.tsx' ? (
                                        <>
                                            <div>
                                                <div className="text-xs font-bold text-terminal-gray-400 mb-2">Before vs After</div>
                                                <div className="space-y-3">
                                                    <div className="glass rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-2 h-2 rounded-full bg-cyber-red"></div>
                                                            <div className="text-xs font-bold text-white">Original Code</div>
                                                        </div>
                                                        <div className="bg-terminal-darker rounded p-2 mb-2">
                                                            <pre className="text-xs text-terminal-gray-400 font-mono">• 4 separate array iterations</pre>
                                                            <pre className="text-xs text-terminal-gray-400 font-mono">• Runtime errors (undefined vars)</pre>
                                                            <pre className="text-xs text-terminal-gray-400 font-mono">• Type safety issues</pre>
                                                        </div>
                                                        <div className="text-xs text-cyber-red">Performance: 35/100</div>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <svg className="w-6 h-6 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                    </div>
                                                    <div className="glass rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-2 h-2 rounded-full bg-cyber-green"></div>
                                                            <div className="text-xs font-bold text-white">Refactored Code</div>
                                                        </div>
                                                        <div className="bg-terminal-darker rounded p-2 mb-2">
                                                            <pre className="text-xs text-cyber-green font-mono">✓ Single array pass (filter→sort→map)</pre>
                                                            <pre className="text-xs text-cyber-green font-mono">✓ All errors fixed</pre>
                                                            <pre className="text-xs text-cyber-green font-mono">✓ Full type safety</pre>
                                                        </div>
                                                        <div className="text-xs text-cyber-green">Performance: 95/100</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-xs font-bold text-terminal-gray-400 mb-2">Impact Summary</div>
                                                <div className="glass rounded-lg p-3 space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-terminal-gray-300">Array iterations</span>
                                                        <span className="text-xs text-cyber-green">-75%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-terminal-gray-300">Runtime errors</span>
                                                        <span className="text-xs text-cyber-green">-100%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-terminal-gray-300">Type safety</span>
                                                        <span className="text-xs text-cyber-green">+40%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-terminal-gray-300">Code quality</span>
                                                        <span className="text-xs text-cyber-green">+171%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-3">📊</div>
                                            <div className="text-sm text-terminal-gray-300 mb-2">No Preview Available</div>
                                            <div className="text-xs text-terminal-gray-500">
                                                {selectedFile.issues.length === 0
                                                    ? 'This file has no issues to compare'
                                                    : 'Select WalletPage.tsx to see comparison'
                                                }
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
