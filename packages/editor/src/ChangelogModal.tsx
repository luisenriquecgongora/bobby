// @bobby/editor/src/ChangelogModal.tsx
// Public Version & Commit Changelog viewer modal with live GitHub sync and sub-URL deep linking (?tab=commits).

import React, { useState, useEffect, useMemo } from 'react';
import {
  APP_VERSION,
  REPOSITORY_URL,
  BUILT_IN_COMMITS,
  CommitEntry,
} from '@bobby/core';
import {
  GitCommit,
  GitBranch,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  X,
  Tag,
  Wifi,
  WifiOff,
} from 'lucide-react';

export interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  repoUrl?: string;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({
  isOpen,
  onClose,
  repoUrl = REPOSITORY_URL,
}) => {
  const [commits, setCommits] = useState<CommitEntry[]>(BUILT_IN_COMMITS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Extract GitHub repo owner/name from repository URL
  const repoSlug = useMemo(() => {
    try {
      const parsed = new URL(repoUrl);
      return parsed.pathname.replace(/^\/|\.git$/g, '');
    } catch {
      return 'luisenriquecgongora/bobby';
    }
  }, [repoUrl]);

  // Fetch latest commits live from GitHub API if online
  const fetchLiveCommits = async () => {
    if (!repoSlug) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${repoSlug}/commits?per_page=30`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      if (res.ok) {
        const data = await res.json();
        const mapped: CommitEntry[] = data.map((item: any) => ({
          hash: item.sha,
          shortHash: item.sha.substring(0, 7),
          author: item.commit?.author?.name || item.author?.login || 'Unknown',
          date: item.commit?.author?.date?.split('T')[0] || '',
          isoDate: item.commit?.author?.date || '',
          subject: item.commit?.message?.split('\n')[0] || '',
        }));
        if (mapped.length > 0) {
          setCommits(mapped);
          setIsLive(true);
        }
      }
    } catch {
      // Fallback silently to pre-bundled local commits
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync URL query param when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      fetchLiveCommits();
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.get('tab') !== 'commits') {
        currentUrl.searchParams.set('tab', 'commits');
        window.history.pushState({}, '', currentUrl.toString());
      }
    } else {
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.get('tab') === 'commits') {
        currentUrl.searchParams.delete('tab');
        window.history.pushState({}, '', currentUrl.toString());
      }
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getCommitType = (subject: string): { label: string; color: string; bg: string } => {
    const lower = subject.toLowerCase();
    if (lower.startsWith('feat')) {
      return { label: 'feat', color: '#10B981', bg: '#064E3B' };
    }
    if (lower.startsWith('fix')) {
      return { label: 'fix', color: '#F59E0B', bg: '#78350F' };
    }
    if (lower.startsWith('chore')) {
      return { label: 'chore', color: '#94A3B8', bg: '#1E293B' };
    }
    if (lower.startsWith('docs')) {
      return { label: 'docs', color: '#38BDF8', bg: '#0C4A6E' };
    }
    if (lower.startsWith('refactor')) {
      return { label: 'refactor', color: '#A855F7', bg: '#581C87' };
    }
    return { label: 'commit', color: '#64748B', bg: '#1E293B' };
  };

  const filteredCommits = useMemo(() => {
    return commits.filter((c) => {
      const matchesSearch =
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortHash.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedCategory === 'all') return true;
      return c.subject.toLowerCase().startsWith(selectedCategory);
    });
  }, [commits, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          color: '#F8FAFC',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0A0F1D',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(20, 184, 166, 0.15)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GitBranch color="#14B8A6" size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                  Release & Commit History
                </h2>
                <span
                  style={{
                    backgroundColor: '#134E4A',
                    color: '#2DD4BF',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Tag size={11} /> v{APP_VERSION}
                </span>
                <span
                  style={{
                    backgroundColor: isLive ? '#064E3B' : '#1E293B',
                    color: isLive ? '#34D399' : '#94A3B8',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title={isLive ? 'Live synchronized with GitHub' : 'Bundled offline commit log'}
                >
                  {isLive ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {isLive ? 'GitHub Live' : 'Offline Log'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>
                Track version updates, features, and full git commit log for Bobby Studio
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={fetchLiveCommits}
              disabled={isLoading}
              title="Refresh commits from GitHub"
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                color: '#94A3B8',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RefreshCw
                size={16}
                style={{
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                }}
              />
            </button>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open repository on GitHub"
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                color: '#14B8A6',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={14} /> GitHub
            </a>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: '#0D1527',
          }}
        >
          {/* Search box */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              maxWidth: '320px',
            }}
          >
            <Search
              size={14}
              color="#64748B"
              style={{ position: 'absolute', left: '10px', top: '10px' }}
            />
            <input
              type="text"
              placeholder="Search commits or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'feat', 'fix', 'chore', 'docs'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === cat ? '#14B8A6' : '#1E293B',
                  color: selectedCategory === cat ? '#0F172A' : '#94A3B8',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Commits List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {filteredCommits.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#64748B',
                fontSize: '13px',
              }}
            >
              No commits matching "{searchQuery}"
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredCommits.map((commit, idx) => {
                const type = getCommitType(commit.subject);
                const isCopied = copiedHash === commit.hash;
                const commitUrl = `${repoUrl}/commit/${commit.hash}`;

                return (
                  <div
                    key={commit.hash || idx}
                    style={{
                      backgroundColor: '#131D33',
                      border: '1px solid #1E293B',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: type.bg,
                            color: type.color,
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            flexShrink: 0,
                          }}
                        >
                          {type.label}
                        </span>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#F8FAFC',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {commit.subject}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexShrink: 0,
                        }}
                      >
                        <a
                          href={commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#1E293B',
                            color: '#38BDF8',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            textDecoration: 'none',
                            border: '1px solid #334155',
                          }}
                        >
                          <GitCommit size={12} /> {commit.shortHash}
                        </a>
                        <button
                          onClick={() => copyToClipboard(commit.hash)}
                          title="Copy full commit SHA"
                          style={{
                            backgroundColor: '#1E293B',
                            border: '1px solid #334155',
                            color: isCopied ? '#10B981' : '#94A3B8',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: '#64748B',
                      }}
                    >
                      <span>by {commit.author}</span>
                      <span>{commit.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#64748B',
            backgroundColor: '#0A0F1D',
          }}
        >
          <span>Bobby 3D Spatial Floorplanner & Constructor</span>
          <span>
            Direct link: <code>?tab=commits</code>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;
