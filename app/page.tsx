'use client'

import React, { useState, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { RiDashboardLine, RiMailSendLine, RiHistoryLine, RiAddLine, RiDeleteBinLine, RiArrowDownSLine, RiArrowUpSLine, RiCheckLine, RiCloseLine, RiSearchLine, RiGithubLine, RiMailLine, RiTrendingUpLine, RiGroupLine, RiLightbulbLine, RiAlertLine, RiStarLine, RiGitBranchLine, RiTimeLine, RiSendPlaneLine, RiRocketLine, RiEditLine, RiFilterLine, RiLoader4Line, RiExternalLinkLine, RiCheckboxCircleLine, RiErrorWarningLine, RiInformationLine, RiCodeSSlashLine, RiBarChartBoxLine, RiFileTextLine } from 'react-icons/ri'

// ── Agent IDs ──
const COORDINATOR_AGENT_ID = '69995cdd746ef9435cac7dad'
const EMAIL_DELIVERY_AGENT_ID = '69995ceea63b170a3b817013'

// ── TypeScript Interfaces ──
interface KeyTrend { trend: string; impact: string; source: string }
interface Competitor { name: string; description: string; funding: string; stage: string }
interface MarketTrends { sector_overview: string; market_size: string; growth_rate: string; key_trends: KeyTrend[]; competitors: Competitor[]; opportunities: string[]; risks: string[] }
interface Repository { name: string; url: string; stars: string; forks: string; language: string; last_activity: string; description: string; key_insights: string }
interface GitHubInsights { repositories: Repository[]; technical_landscape_summary: string; technology_trends: string[]; recommendations: string[] }
interface Investor { name: string; firm: string; email: string; match_score: string; rationale: string; draft_email_subject: string; draft_email_body: string }
interface InvestorOutreach { investors: Investor[]; total_investors_found: string; search_criteria_summary: string }
interface CoordinatorResponse { market_trends: MarketTrends; github_insights: GitHubInsights; investor_outreach: InvestorOutreach; executive_summary: string }
interface EmailResult { recipient_email: string; recipient_name: string; subject: string; status: string; error_message: string }
interface EmailDeliveryResponse { emails_sent: EmailResult[]; total_sent: string; total_failed: string; summary: string }
interface Campaign { id: string; date: string; sector: string; stage: string; geography: string[]; investorsFound: number; emailsSent: number; status: string; data: CoordinatorResponse | null; emailResults: EmailDeliveryResponse | null }

// ── Form State Interface ──
interface FormData {
  sector: string
  stage: string
  geographies: string[]
  investmentMin: string
  investmentMax: string
  githubRepos: string[]
  studentFriendly: boolean
  valueAddFocus: boolean
  localPreferred: boolean
}

// ── Sample Data ──
const SAMPLE_COORDINATOR_RESPONSE: CoordinatorResponse = {
  market_trends: {
    sector_overview: 'The AI/ML sector continues to experience unprecedented growth, driven by advances in large language models, generative AI, and enterprise automation. The market is characterized by rapid innovation cycles, increasing enterprise adoption, and significant venture capital interest across all stages.',
    market_size: '$196.6 billion (2024), projected to reach $1.81 trillion by 2030',
    growth_rate: '36.6% CAGR (2024-2030)',
    key_trends: [
      { trend: 'Enterprise GenAI Adoption', impact: 'Companies are rapidly integrating generative AI into core workflows, creating demand for specialized tools and platforms', source: 'McKinsey Global Survey 2024' },
      { trend: 'AI Agent Frameworks', impact: 'Autonomous AI agents are becoming the next platform shift, enabling complex multi-step task automation', source: 'Sequoia Capital AI Report' },
      { trend: 'Vertical AI Solutions', impact: 'Industry-specific AI applications are outperforming horizontal solutions in customer retention and revenue growth', source: 'a16z State of AI 2024' },
      { trend: 'Open Source AI Models', impact: 'Open-weight models like Llama and Mistral are democratizing AI capabilities, lowering barriers to entry', source: 'Hugging Face Ecosystem Report' }
    ],
    competitors: [
      { name: 'LangChain', description: 'Framework for building applications with LLMs, providing tools for chaining, agents, and retrieval', funding: '$35M Series A', stage: 'Series A' },
      { name: 'CrewAI', description: 'Multi-agent orchestration platform for building collaborative AI agent systems', funding: '$18M Seed', stage: 'Seed' },
      { name: 'AutoGen (Microsoft)', description: 'Open-source framework for building multi-agent conversational AI systems', funding: 'Corporate backed', stage: 'N/A' },
      { name: 'Fixie.ai', description: 'Platform for building natural language agents that connect to enterprise data and APIs', funding: '$17M Series A', stage: 'Series A' }
    ],
    opportunities: [
      'Growing demand for no-code/low-code AI agent builders among non-technical teams',
      'Enterprise compliance and governance tooling for AI agents is severely underserved',
      'Integration marketplace connecting AI agents with existing business tools (CRM, ERP, HRIS)',
      'Vertical-specific agent templates for healthcare, legal, and financial services'
    ],
    risks: [
      'Regulatory uncertainty around autonomous AI systems in the EU and US',
      'Platform risk from major cloud providers (AWS, Azure, GCP) building competing features',
      'Rapid commoditization of core LLM capabilities may compress margins',
      'Customer acquisition costs are high due to fragmented enterprise buying processes'
    ]
  },
  github_insights: {
    repositories: [
      { name: 'langchain-ai/langchain', url: 'https://github.com/langchain-ai/langchain', stars: '92.4k', forks: '14.8k', language: 'Python', last_activity: '2 hours ago', description: 'Building applications with LLMs through composability', key_insights: 'Extremely active development with 2,800+ contributors. Strong ecosystem of integrations. Rapid iteration on agent capabilities.' },
      { name: 'microsoft/autogen', url: 'https://github.com/microsoft/autogen', stars: '31.2k', forks: '4.5k', language: 'Python', last_activity: '5 hours ago', description: 'Multi-agent conversation framework for next-gen AI applications', key_insights: 'Corporate backing provides stability. Focus on multi-agent patterns. Growing enterprise adoption.' },
      { name: 'joaomdmoura/crewAI', url: 'https://github.com/joaomdmoura/crewAI', stars: '19.8k', forks: '2.7k', language: 'Python', last_activity: '1 day ago', description: 'Framework for orchestrating role-playing autonomous AI agents', key_insights: 'Fastest-growing in the agent space. Simple API appeals to developers. Strong community engagement.' }
    ],
    technical_landscape_summary: 'The AI agent ecosystem is rapidly maturing with Python as the dominant language. Key architectural patterns include ReAct-style reasoning, tool-use protocols, and multi-agent orchestration. Vector databases and RAG pipelines are standard components. The trend is moving toward more autonomous, less supervised agent behaviors.',
    technology_trends: [
      'Multi-agent orchestration patterns are becoming standardized',
      'Tool-use and function-calling capabilities are table stakes',
      'Memory and context management for long-running agents',
      'Evaluation frameworks for agent reliability and safety',
      'Edge deployment of smaller, specialized models'
    ],
    recommendations: [
      'Differentiate through superior agent observability and debugging tools',
      'Build proprietary evaluation benchmarks for agent performance',
      'Focus on enterprise-grade security and audit trails',
      'Develop pre-built agent templates for common business workflows'
    ]
  },
  investor_outreach: {
    investors: [
      { name: 'Sarah Chen', firm: 'Lightspeed Venture Partners', email: 'sarah.chen@lsvp.com', match_score: '92', rationale: 'Active AI/ML investor, led multiple seed rounds in developer tools. Portfolio includes several AI infrastructure companies. Known for hands-on support with technical founders.', draft_email_subject: 'AI Agent Platform -- Seed Round Opportunity', draft_email_body: 'Hi Sarah,\n\nI am reaching out because your investments in AI developer tools (particularly your work with Pinecone and Scale AI) align closely with what we are building.\n\nWe are developing an AI agent orchestration platform that enables enterprises to deploy, manage, and monitor autonomous AI agents at scale. Our key differentiators include built-in compliance controls, multi-agent collaboration protocols, and a no-code builder for non-technical teams.\n\nKey metrics:\n- 3x MoM growth in pilot customers\n- 15 enterprise design partners\n- $2M ARR run-rate\n\nWould love to share more over a 20-minute call. Would next week work?\n\nBest regards' },
      { name: 'Michael Torres', firm: 'First Round Capital', email: 'm.torres@firstround.com', match_score: '87', rationale: 'Focuses on seed-stage enterprise SaaS. Strong track record helping founders with GTM strategy. Portfolio overlap with AI tooling companies.', draft_email_subject: 'Reimagining Enterprise AI Automation', draft_email_body: 'Hi Michael,\n\nFirst Round\'s thesis on empowering builders resonates strongly with our mission. We are building the orchestration layer for enterprise AI agents.\n\nOur platform solves the critical gap between powerful AI models and reliable enterprise deployment. Think of us as the "Kubernetes for AI agents" -- providing the infrastructure layer that makes autonomous AI production-ready.\n\nWe are raising a seed round and would welcome the opportunity to share our vision and traction.\n\nBest regards' },
      { name: 'Priya Sharma', firm: 'Accel Partners', email: 'priya@accel.com', match_score: '85', rationale: 'Deep expertise in enterprise AI infrastructure. Led investments in developer-first platforms. Strong network in the AI ecosystem.', draft_email_subject: 'AI Agent Infrastructure -- Seed Investment', draft_email_body: 'Hi Priya,\n\nYour investment thesis around AI infrastructure platforms aligns with what we are building. We are creating the definitive platform for enterprise AI agent management.\n\nOur differentiators:\n1. Multi-agent orchestration with built-in safety rails\n2. No-code agent builder for business teams\n3. Enterprise compliance and governance dashboard\n4. Pre-built integrations with 50+ business tools\n\nWe would love to discuss how we fit into your AI infrastructure portfolio.\n\nBest regards' },
      { name: 'David Kim', firm: 'Y Combinator', email: 'david@ycombinator.com', match_score: '78', rationale: 'YC has strong alumni network in AI. Batch program provides intensive go-to-market support. Good fit for early-stage with technical founders.', draft_email_subject: 'YC Application -- AI Agent Platform', draft_email_body: 'Hi David,\n\nWe are applying to Y Combinator with our AI agent orchestration platform. Our founding team includes ex-Google AI engineers with deep expertise in multi-agent systems.\n\nWe have built and deployed agents for 15 enterprise customers in the past 6 months, achieving strong product-market fit indicators.\n\nWould appreciate the chance to discuss our application and get your perspective on the AI agent space.\n\nBest regards' }
    ],
    total_investors_found: '4',
    search_criteria_summary: 'Searched for investors matching: AI/ML sector, Seed stage, North America focus, $500K-$3M check sizes, with preference for student-friendly and value-add investors'
  },
  executive_summary: '## Research Summary\n\nThe AI agent market represents a massive opportunity with a projected $1.81T market size by 2030. Key findings:\n\n**Market Position:** The space is growing rapidly at 36.6% CAGR with enterprise adoption accelerating. While competitors like LangChain and CrewAI have gained traction, significant whitespace exists in enterprise compliance, no-code tooling, and vertical solutions.\n\n**Technical Landscape:** GitHub analysis reveals a maturing ecosystem centered on Python, with multi-agent orchestration emerging as the dominant architectural pattern. Differentiation opportunities exist in observability, evaluation, and enterprise security.\n\n**Investor Pipeline:** Identified 4 high-match investors across top-tier firms. Average match score of 85.5%. All have active AI/ML investment theses and relevant portfolio companies.\n\n**Recommended Next Steps:**\n1. Prioritize outreach to Sarah Chen (Lightspeed) and Michael Torres (First Round) based on highest match scores\n2. Refine pitch deck to emphasize enterprise compliance differentiation\n3. Prepare technical deep-dive materials for investor meetings'
}

const SAMPLE_EMAIL_RESPONSE: EmailDeliveryResponse = {
  emails_sent: [
    { recipient_email: 'sarah.chen@lsvp.com', recipient_name: 'Sarah Chen', subject: 'AI Agent Platform -- Seed Round Opportunity', status: 'sent', error_message: '' },
    { recipient_email: 'm.torres@firstround.com', recipient_name: 'Michael Torres', subject: 'Reimagining Enterprise AI Automation', status: 'sent', error_message: '' },
    { recipient_email: 'priya@accel.com', recipient_name: 'Priya Sharma', subject: 'AI Agent Infrastructure -- Seed Investment', status: 'sent', error_message: '' },
    { recipient_email: 'david@ycombinator.com', recipient_name: 'David Kim', subject: 'YC Application -- AI Agent Platform', status: 'failed', error_message: 'Rate limit exceeded, retry in 60 seconds' }
  ],
  total_sent: '3',
  total_failed: '1',
  summary: 'Successfully delivered 3 out of 4 outreach emails. 1 email failed due to Gmail rate limiting. Recommend retrying failed email after a brief wait.'
}

// ── Constants ──
const SECTORS = ['AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'SaaS', 'E-commerce', 'CleanTech', 'BioTech', 'Cybersecurity', 'Other']
const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B']
const GEOGRAPHIES = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa']
const LS_KEY = 'launchpad_campaigns'

// ── Helpers ──
function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)
}

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

function getMatchScoreColor(score: string): string {
  const num = parseInt(score, 10)
  if (isNaN(num)) return 'bg-muted text-muted-foreground'
  if (num >= 80) return 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
  if (num >= 60) return 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
  return 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
}

function loadCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch { return [] }
}

function saveCampaigns(campaigns: Campaign[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(campaigns))
  } catch { /* storage full or unavailable */ }
}

function parseCoordinatorResponse(result: any): CoordinatorResponse | null {
  if (!result) return null
  let parsed = result
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed) } catch { return null }
  }
  if (parsed?.market_trends || parsed?.github_insights || parsed?.investor_outreach || parsed?.executive_summary) {
    return parsed as CoordinatorResponse
  }
  return null
}

function parseEmailResponse(result: any): EmailDeliveryResponse | null {
  if (!result) return null
  let parsed = result
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed) } catch { return null }
  }
  if (parsed?.emails_sent || parsed?.total_sent || parsed?.summary) {
    return parsed as EmailDeliveryResponse
  }
  return null
}

// ── ErrorBoundary ──
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Skeleton Loader ──
function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-md animate-pulse space-y-4">
      <div className="h-5 bg-muted rounded w-2/3"></div>
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="h-4 bg-muted rounded w-3/4"></div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse h-8 bg-muted rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

// ── Sidebar Navigation ──
function Sidebar({ activeTab, setActiveTab, hasResearchData }: { activeTab: string; setActiveTab: (tab: string) => void; hasResearchData: boolean }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: RiDashboardLine },
    { id: 'review', label: 'Review & Send', icon: RiMailSendLine, badge: hasResearchData },
    { id: 'history', label: 'Campaign History', icon: RiHistoryLine },
  ]
  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <RiRocketLine className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-sidebar-foreground">LaunchPad</h1>
            <p className="text-xs text-muted-foreground">Startup Research Suite</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-primary font-semibold' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-sidebar-primary' : ''}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto w-2 h-2 rounded-full bg-sidebar-primary animate-pulse"></span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-card border border-border rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">Powered by AI Agents</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiGroupLine className="w-3.5 h-3.5 text-sidebar-primary" />
              <span>Research Coordinator</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiTrendingUpLine className="w-3.5 h-3.5 text-emerald-500" />
              <span>Market Trends Agent</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiGithubLine className="w-3.5 h-3.5 text-emerald-500" />
              <span>GitHub Insights Agent</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiSearchLine className="w-3.5 h-3.5 text-emerald-500" />
              <span>Investor List Agent</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiMailLine className="w-3.5 h-3.5 text-emerald-500" />
              <span>Email Delivery Agent</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ── Dashboard Screen ──
function DashboardScreen({
  formData,
  setFormData,
  onSubmit,
  isLoading,
  error,
  sampleMode,
}: {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  onSubmit: () => void
  isLoading: boolean
  error: string | null
  sampleMode: boolean
}) {
  const addRepo = () => {
    setFormData(prev => ({ ...prev, githubRepos: [...prev.githubRepos, ''] }))
  }
  const removeRepo = (index: number) => {
    setFormData(prev => ({ ...prev, githubRepos: prev.githubRepos.filter((_, i) => i !== index) }))
  }
  const updateRepo = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      githubRepos: prev.githubRepos.map((r, i) => i === index ? value : r)
    }))
  }
  const toggleGeography = (geo: string) => {
    setFormData(prev => ({
      ...prev,
      geographies: prev.geographies.includes(geo) ? prev.geographies.filter(g => g !== geo) : [...prev.geographies, geo]
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Enter your startup details to generate comprehensive research, competitor analysis, and investor outreach drafts.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
          <RiErrorWarningLine className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">Error</p>
            <p className="text-sm text-red-300/80">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
            <RiLoader4Line className="w-6 h-6 text-sidebar-primary animate-spin" />
            <div>
              <p className="text-sm font-semibold text-foreground">Researching... this may take a few minutes</p>
              <p className="text-xs text-muted-foreground mt-1">Our AI agents are analyzing market trends, GitHub repositories, and investor databases.</p>
            </div>
          </div>
          <SkeletonGrid />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Sector */}
            <div className="bg-card border border-border rounded-lg p-5 shadow-md space-y-4">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <RiBarChartBoxLine className="w-4 h-4 text-sidebar-primary" />
                Sector
              </label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              >
                <option value="">Select a sector...</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Stage */}
            <div className="bg-card border border-border rounded-lg p-5 shadow-md space-y-4">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <RiRocketLine className="w-4 h-4 text-sidebar-primary" />
                Funding Stage
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STAGES.map(stage => (
                  <button
                    key={stage}
                    onClick={() => setFormData(prev => ({ ...prev, stage }))}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${formData.stage === stage ? 'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary shadow-lg shadow-emerald-900/30' : 'bg-input border-border text-foreground hover:bg-secondary'}`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Geography */}
            <div className="bg-card border border-border rounded-lg p-5 shadow-md space-y-4">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <RiFilterLine className="w-4 h-4 text-sidebar-primary" />
                Geography
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GEOGRAPHIES.map(geo => {
                  const checked = formData.geographies.includes(geo)
                  return (
                    <button
                      key={geo}
                      onClick={() => toggleGeography(geo)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${checked ? 'bg-sidebar-primary/15 border-sidebar-primary/50 text-sidebar-primary' : 'bg-input border-border text-foreground hover:bg-secondary'}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-sidebar-primary border-sidebar-primary' : 'border-border'}`}>
                        {checked && <RiCheckLine className="w-3 h-3 text-sidebar-primary-foreground" />}
                      </div>
                      {geo}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Investment Range */}
            <div className="bg-card border border-border rounded-lg p-5 shadow-md space-y-4">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <RiTrendingUpLine className="w-4 h-4 text-sidebar-primary" />
                Investment Size Range (USD)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Minimum</label>
                  <input
                    type="text"
                    placeholder="e.g. 500000"
                    value={formData.investmentMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, investmentMin: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Maximum</label>
                  <input
                    type="text"
                    placeholder="e.g. 3000000"
                    value={formData.investmentMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, investmentMax: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* GitHub Repos */}
            <div className="bg-card border border-border rounded-lg p-5 shadow-md space-y-4">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <RiGithubLine className="w-4 h-4 text-sidebar-primary" />
                GitHub Repository URLs
              </label>
              <p className="text-xs text-muted-foreground">Add GitHub repositories to analyze your technical landscape and competitors.</p>
              <div className="space-y-2">
                {formData.githubRepos.map((repo, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://github.com/org/repo"
                      value={repo}
                      onChange={(e) => updateRepo(i, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    />
                    <button
                      onClick={() => removeRepo(i)}
                      className="px-3 py-2.5 bg-destructive/10 border border-destructive/30 rounded-lg text-red-400 hover:bg-destructive/20 transition-colors"
                    >
                      <RiDeleteBinLine className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addRepo}
                className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <RiAddLine className="w-4 h-4" />
                Add Repository
              </button>
            </div>

            {/* Investor Preferences */}
            <div className="bg-card border border-border rounded-lg p-5 shadow-md space-y-4">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <RiLightbulbLine className="w-4 h-4 text-sidebar-primary" />
                Investor Preferences
              </label>
              {[
                { key: 'studentFriendly' as const, label: 'Student-friendly investors', desc: 'Prioritize investors known for backing student and early-career founders' },
                { key: 'valueAddFocus' as const, label: 'Value-add focus', desc: 'Prefer investors who offer hands-on mentoring and operational support' },
                { key: 'localPreferred' as const, label: 'Local investors preferred', desc: 'Weight results toward investors in your selected geographies' },
              ].map(pref => (
                <button
                  key={pref.key}
                  onClick={() => setFormData(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className={`mt-0.5 w-9 h-5 rounded-full flex items-center transition-colors shrink-0 ${formData[pref.key] ? 'bg-sidebar-primary' : 'bg-muted'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData[pref.key] ? 'translate-x-[18px]' : 'translate-x-[2px]'}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{pref.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      {!isLoading && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onSubmit}
            disabled={!formData.sector || !formData.stage || formData.geographies.length === 0}
            className="flex items-center gap-3 px-8 py-4 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg font-semibold tracking-tight hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30 text-base"
          >
            <RiRocketLine className="w-5 h-5" />
            Generate Research & Drafts
          </button>
        </div>
      )}
    </div>
  )
}

// ── Review & Send Screen ──
function ReviewScreen({
  data,
  sampleMode,
  emailResults,
  setEmailResults,
  isSendingEmails,
  setIsSendingEmails,
  sendError,
  setSendError,
  activeAgentId,
  setActiveAgentId,
  campaigns,
  setCampaigns,
  formData,
}: {
  data: CoordinatorResponse | null
  sampleMode: boolean
  emailResults: EmailDeliveryResponse | null
  setEmailResults: (r: EmailDeliveryResponse | null) => void
  isSendingEmails: boolean
  setIsSendingEmails: (v: boolean) => void
  sendError: string | null
  setSendError: (e: string | null) => void
  activeAgentId: string | null
  setActiveAgentId: (id: string | null) => void
  campaigns: Campaign[]
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>
  formData: FormData
}) {
  const [reviewTab, setReviewTab] = useState<'market' | 'github' | 'investors'>('market')
  const [approvedInvestors, setApprovedInvestors] = useState<Record<string, boolean>>({})
  const [editedEmails, setEditedEmails] = useState<Record<string, { subject: string; body: string }>>({})
  const [expandedInvestors, setExpandedInvestors] = useState<Record<string, boolean>>({})

  const displayData = sampleMode ? SAMPLE_COORDINATOR_RESPONSE : data

  // Initialize approvals and edits when data changes
  useEffect(() => {
    if (!displayData?.investor_outreach?.investors) return
    const investors = displayData.investor_outreach.investors
    if (!Array.isArray(investors)) return
    const approvals: Record<string, boolean> = {}
    const edits: Record<string, { subject: string; body: string }> = {}
    investors.forEach((inv, i) => {
      const key = `${inv?.email ?? ''}-${i}`
      approvals[key] = true
      edits[key] = { subject: inv?.draft_email_subject ?? '', body: inv?.draft_email_body ?? '' }
    })
    setApprovedInvestors(approvals)
    setEditedEmails(edits)
  }, [displayData])

  const approvedCount = Object.values(approvedInvestors).filter(Boolean).length

  const handleSendEmails = async () => {
    if (!displayData?.investor_outreach?.investors) return
    const investors = displayData.investor_outreach.investors
    if (!Array.isArray(investors)) return

    const approved = investors.filter((inv, i) => {
      const key = `${inv?.email ?? ''}-${i}`
      return approvedInvestors[key]
    }).map((inv, i) => {
      const key = `${inv?.email ?? ''}-${i}`
      const edited = editedEmails[key]
      return {
        to: inv?.email ?? '',
        name: inv?.name ?? '',
        subject: edited?.subject ?? inv?.draft_email_subject ?? '',
        body: edited?.body ?? inv?.draft_email_body ?? ''
      }
    })

    if (approved.length === 0) {
      setSendError('No investors selected. Please approve at least one investor to send emails.')
      return
    }

    if (sampleMode) {
      setEmailResults(SAMPLE_EMAIL_RESPONSE)
      return
    }

    setIsSendingEmails(true)
    setSendError(null)
    setActiveAgentId(EMAIL_DELIVERY_AGENT_ID)

    try {
      const message = 'Send the following emails: ' + JSON.stringify(approved)
      const result = await callAIAgent(message, EMAIL_DELIVERY_AGENT_ID)
      if (result.success) {
        let parsed = result?.response?.result
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed) } catch { /* use as-is */ }
        }
        const emailRes = parseEmailResponse(parsed)
        if (emailRes) {
          setEmailResults(emailRes)
          // Save to campaign history
          const newCampaign: Campaign = {
            id: generateId(),
            date: new Date().toISOString(),
            sector: formData.sector,
            stage: formData.stage,
            geography: formData.geographies,
            investorsFound: Array.isArray(displayData?.investor_outreach?.investors) ? displayData.investor_outreach.investors.length : 0,
            emailsSent: parseInt(emailRes?.total_sent ?? '0', 10),
            status: 'Emails Sent',
            data: displayData,
            emailResults: emailRes
          }
          setCampaigns(prev => {
            const updated = [newCampaign, ...prev]
            saveCampaigns(updated)
            return updated
          })
        } else {
          setSendError('Unexpected response format from email delivery agent.')
        }
      } else {
        setSendError(result?.error ?? 'Failed to send emails. Please try again.')
      }
    } catch (err) {
      setSendError('Network error while sending emails. Please try again.')
    } finally {
      setIsSendingEmails(false)
      setActiveAgentId(null)
    }
  }

  if (!displayData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <RiFileTextLine className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Research Data Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">Run a research query from the Dashboard to see market trends, GitHub insights, and investor recommendations here.</p>
      </div>
    )
  }

  const reviewTabs = [
    { id: 'market' as const, label: 'Market Trends', icon: RiTrendingUpLine },
    { id: 'github' as const, label: 'GitHub Insights', icon: RiGithubLine },
    { id: 'investors' as const, label: 'Investor Outreach', icon: RiGroupLine },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Review & Send</h2>
        <p className="text-muted-foreground text-sm mt-1">Review your research findings, edit outreach emails, and send to approved investors.</p>
      </div>

      {/* Executive Summary */}
      {displayData?.executive_summary && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <RiLightbulbLine className="w-5 h-5 text-sidebar-primary" />
            <h3 className="text-base font-semibold text-foreground">Executive Summary</h3>
          </div>
          <div className="text-card-foreground">{renderMarkdown(displayData.executive_summary)}</div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg border border-border">
        {reviewTabs.map(tab => {
          const Icon = tab.icon
          const isActive = reviewTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setReviewTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-card text-foreground shadow-md border border-border' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Market Trends Tab */}
      {reviewTab === 'market' && (
        <div className="space-y-5">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-5 shadow-md">
              <p className="text-xs text-muted-foreground font-medium mb-1">Market Size</p>
              <p className="text-lg font-bold text-foreground">{displayData?.market_trends?.market_size ?? 'N/A'}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 shadow-md">
              <p className="text-xs text-muted-foreground font-medium mb-1">Growth Rate</p>
              <p className="text-lg font-bold text-sidebar-primary">{displayData?.market_trends?.growth_rate ?? 'N/A'}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 shadow-md">
              <p className="text-xs text-muted-foreground font-medium mb-1">Competitors Tracked</p>
              <p className="text-lg font-bold text-foreground">{Array.isArray(displayData?.market_trends?.competitors) ? displayData.market_trends.competitors.length : 0}</p>
            </div>
          </div>

          {/* Sector Overview */}
          {displayData?.market_trends?.sector_overview && (
            <div className="bg-card border border-border rounded-lg p-5 shadow-md">
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <RiInformationLine className="w-4 h-4 text-sidebar-primary" />
                Sector Overview
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{displayData.market_trends.sector_overview}</p>
            </div>
          )}

          {/* Key Trends */}
          {Array.isArray(displayData?.market_trends?.key_trends) && displayData.market_trends.key_trends.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <RiTrendingUpLine className="w-4 h-4 text-sidebar-primary" />
                Key Trends
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayData.market_trends.key_trends.map((trend, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-5 shadow-md space-y-2">
                    <h5 className="text-sm font-semibold text-foreground">{trend?.trend ?? 'Trend'}</h5>
                    <p className="text-sm text-muted-foreground">{trend?.impact ?? ''}</p>
                    <p className="text-xs text-sidebar-primary/70 italic">{trend?.source ?? ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitors */}
          {Array.isArray(displayData?.market_trends?.competitors) && displayData.market_trends.competitors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <RiGroupLine className="w-4 h-4 text-sidebar-primary" />
                Competitors
              </h4>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Funding</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.market_trends.competitors.map((comp, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{comp?.name ?? ''}</td>
                        <td className="py-3 px-4 text-muted-foreground">{comp?.description ?? ''}</td>
                        <td className="py-3 px-4"><span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">{comp?.funding ?? ''}</span></td>
                        <td className="py-3 px-4"><span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sidebar-primary/15 text-sidebar-primary">{comp?.stage ?? ''}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Opportunities & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(displayData?.market_trends?.opportunities) && displayData.market_trends.opportunities.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-5 shadow-md">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <RiLightbulbLine className="w-4 h-4 text-emerald-400" />
                  Opportunities
                </h4>
                <div className="space-y-2">
                  {displayData.market_trends.opportunities.map((opp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-muted-foreground">{opp ?? ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(displayData?.market_trends?.risks) && displayData.market_trends.risks.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-5 shadow-md">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <RiAlertLine className="w-4 h-4 text-red-400" />
                  Risks
                </h4>
                <div className="space-y-2">
                  {displayData.market_trends.risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600/20 text-red-400 border border-red-500/30 shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-muted-foreground">{risk ?? ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GitHub Insights Tab */}
      {reviewTab === 'github' && (
        <div className="space-y-5">
          {/* Technical Summary */}
          {displayData?.github_insights?.technical_landscape_summary && (
            <div className="bg-card border border-border rounded-lg p-5 shadow-md">
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <RiCodeSSlashLine className="w-4 h-4 text-sidebar-primary" />
                Technical Landscape Summary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{displayData.github_insights.technical_landscape_summary}</p>
            </div>
          )}

          {/* Repositories */}
          {Array.isArray(displayData?.github_insights?.repositories) && displayData.github_insights.repositories.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <RiGithubLine className="w-4 h-4 text-sidebar-primary" />
                Repositories
              </h4>
              <div className="space-y-4">
                {displayData.github_insights.repositories.map((repo, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-5 shadow-md">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <a
                          href={repo?.url ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-sidebar-primary hover:underline flex items-center gap-1.5"
                        >
                          {repo?.name ?? 'Repository'}
                          <RiExternalLinkLine className="w-3.5 h-3.5" />
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">{repo?.description ?? ''}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-600/15 text-yellow-400 border border-yellow-500/30">
                        <RiStarLine className="w-3 h-3" />
                        {repo?.stars ?? '0'}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-600/15 text-blue-400 border border-blue-500/30">
                        <RiGitBranchLine className="w-3 h-3" />
                        {repo?.forks ?? '0'}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-600/15 text-purple-400 border border-purple-500/30">
                        {repo?.language ?? 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
                        <RiTimeLine className="w-3 h-3" />
                        {repo?.last_activity ?? ''}
                      </span>
                    </div>
                    {repo?.key_insights && (
                      <div className="bg-secondary/50 rounded-md p-3">
                        <p className="text-xs font-semibold text-foreground mb-1">Key Insights</p>
                        <p className="text-xs text-muted-foreground">{repo.key_insights}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Trends & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(displayData?.github_insights?.technology_trends) && displayData.github_insights.technology_trends.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-5 shadow-md">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <RiTrendingUpLine className="w-4 h-4 text-sidebar-primary" />
                  Technology Trends
                </h4>
                <div className="space-y-2">
                  {displayData.github_insights.technology_trends.map((trend, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sidebar-primary mt-1.5 shrink-0"></span>
                      <p className="text-sm text-muted-foreground">{trend ?? ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(displayData?.github_insights?.recommendations) && displayData.github_insights.recommendations.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-5 shadow-md">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <RiLightbulbLine className="w-4 h-4 text-sidebar-primary" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {displayData.github_insights.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sidebar-primary/15 text-sidebar-primary shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-muted-foreground">{rec ?? ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Investor Outreach Tab */}
      {reviewTab === 'investors' && (
        <div className="space-y-5">
          {/* Summary Bar */}
          <div className="bg-card border border-border rounded-lg p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Search Criteria</p>
              <p className="text-sm text-foreground mt-1">{displayData?.investor_outreach?.search_criteria_summary ?? 'N/A'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-sidebar-primary">{displayData?.investor_outreach?.total_investors_found ?? '0'}</p>
                <p className="text-xs text-muted-foreground">Investors Found</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </div>

          {/* Send Error */}
          {sendError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
              <RiErrorWarningLine className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">Send Error</p>
                <p className="text-sm text-red-300/80">{sendError}</p>
              </div>
            </div>
          )}

          {/* Email Results */}
          {emailResults && (
            <div className="bg-card border border-sidebar-primary/30 rounded-lg p-5 shadow-md space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <RiCheckboxCircleLine className="w-5 h-5 text-sidebar-primary" />
                <h4 className="text-sm font-semibold text-foreground">Email Delivery Results</h4>
              </div>
              <div className="flex gap-4 mb-3">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                  {emailResults?.total_sent ?? '0'} Sent
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                  {emailResults?.total_failed ?? '0'} Failed
                </span>
              </div>
              {emailResults?.summary && (
                <p className="text-sm text-muted-foreground">{emailResults.summary}</p>
              )}
              {Array.isArray(emailResults?.emails_sent) && emailResults.emails_sent.length > 0 && (
                <div className="space-y-2 mt-3">
                  {emailResults.emails_sent.map((em, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${(em?.status ?? '').toLowerCase() === 'sent' ? 'bg-emerald-600/5 border-emerald-500/20' : 'bg-red-600/5 border-red-500/20'}`}>
                      <div>
                        <p className="text-sm font-medium text-foreground">{em?.recipient_name ?? em?.recipient_email ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{em?.subject ?? ''}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(em?.status ?? '').toLowerCase() === 'sent' ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400">
                            <RiCheckLine className="w-3 h-3" /> Sent
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-600/20 text-red-400" title={em?.error_message ?? ''}>
                            <RiCloseLine className="w-3 h-3" /> Failed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Investor Cards */}
          {Array.isArray(displayData?.investor_outreach?.investors) && displayData.investor_outreach.investors.length > 0 && (
            <div className="space-y-4">
              {displayData.investor_outreach.investors.map((inv, i) => {
                const key = `${inv?.email ?? ''}-${i}`
                const isApproved = approvedInvestors[key] ?? true
                const isExpanded = expandedInvestors[key] ?? false
                const edited = editedEmails[key]
                return (
                  <div key={key} className={`bg-card border rounded-lg shadow-md transition-all ${isApproved ? 'border-sidebar-primary/30' : 'border-border opacity-60'}`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {/* Approval Checkbox */}
                          <button
                            onClick={() => setApprovedInvestors(prev => ({ ...prev, [key]: !prev[key] }))}
                            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isApproved ? 'bg-sidebar-primary border-sidebar-primary' : 'border-border hover:border-muted-foreground'}`}
                          >
                            {isApproved && <RiCheckLine className="w-3 h-3 text-sidebar-primary-foreground" />}
                          </button>
                          <div>
                            <h5 className="text-sm font-semibold text-foreground">{inv?.name ?? 'Investor'}</h5>
                            <p className="text-xs text-muted-foreground">{inv?.firm ?? ''}</p>
                            <p className="text-xs text-sidebar-primary/70 mt-0.5">{inv?.email ?? ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getMatchScoreColor(inv?.match_score ?? '')}`}>
                            {inv?.match_score ?? '?'}% match
                          </span>
                        </div>
                      </div>
                      {inv?.rationale && (
                        <p className="text-sm text-muted-foreground mt-3 ml-8">{inv.rationale}</p>
                      )}

                      {/* Toggle Email Draft */}
                      <button
                        onClick={() => setExpandedInvestors(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="flex items-center gap-2 mt-3 ml-8 text-xs font-medium text-sidebar-primary hover:text-sidebar-primary/80 transition-colors"
                      >
                        <RiEditLine className="w-3.5 h-3.5" />
                        {isExpanded ? 'Hide' : 'View & Edit'} Draft Email
                        {isExpanded ? <RiArrowUpSLine className="w-4 h-4" /> : <RiArrowDownSLine className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expanded Email Editor */}
                    {isExpanded && (
                      <div className="border-t border-border px-5 py-4 bg-secondary/20 space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-foreground mb-1 block">Subject</label>
                          <input
                            type="text"
                            value={edited?.subject ?? ''}
                            onChange={(e) => setEditedEmails(prev => ({ ...prev, [key]: { ...(prev[key] ?? { subject: '', body: '' }), subject: e.target.value } }))}
                            className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-foreground mb-1 block">Body</label>
                          <textarea
                            rows={8}
                            value={edited?.body ?? ''}
                            onChange={(e) => setEditedEmails(prev => ({ ...prev, [key]: { ...(prev[key] ?? { subject: '', body: '' }), body: e.target.value } }))}
                            className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Send Button */}
          {!emailResults && (
            <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border -mx-6 px-6 py-4 mt-6">
              <button
                onClick={handleSendEmails}
                disabled={isSendingEmails || approvedCount === 0}
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg font-semibold tracking-tight hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
              >
                {isSendingEmails ? (
                  <>
                    <RiLoader4Line className="w-5 h-5 animate-spin" />
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <RiSendPlaneLine className="w-5 h-5" />
                    Send {approvedCount} Approved Email{approvedCount !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Campaign History Screen ──
function HistoryScreen({
  campaigns,
}: {
  campaigns: Campaign[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)

  const filtered = campaigns.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (c.sector ?? '').toLowerCase().includes(q) || (c.stage ?? '').toLowerCase().includes(q) || (c.status ?? '').toLowerCase().includes(q)
  })

  if (campaigns.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign History</h2>
          <p className="text-muted-foreground text-sm mt-1">Track past research runs and outreach campaigns.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <RiHistoryLine className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Campaigns Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">Start your first research run from the Dashboard to see your campaign history here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign History</h2>
          <p className="text-muted-foreground text-sm mt-1">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm w-64"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(campaign => {
          const isExpanded = expandedCampaign === campaign.id
          const dateStr = campaign.date ? new Date(campaign.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown date'
          const statusColor = (campaign.status ?? '').includes('Sent') ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : (campaign.status ?? '').includes('Completed') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'

          return (
            <div key={campaign.id} className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <RiBarChartBoxLine className="w-5 h-5 text-sidebar-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{campaign.sector ?? 'Unknown Sector'} - {campaign.stage ?? 'Unknown Stage'}</p>
                    <p className="text-xs text-muted-foreground">{dateStr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">{campaign.investorsFound ?? 0} investors</p>
                    <p className="text-xs text-muted-foreground">{campaign.emailsSent ?? 0} emails sent</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                    {campaign.status ?? 'Draft'}
                  </span>
                  {isExpanded ? <RiArrowUpSLine className="w-5 h-5 text-muted-foreground" /> : <RiArrowDownSLine className="w-5 h-5 text-muted-foreground" />}
                </div>
              </button>
              {isExpanded && campaign.data && (
                <div className="border-t border-border px-5 py-4 bg-secondary/10 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Sector</p>
                      <p className="text-sm font-medium text-foreground">{campaign.sector ?? ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stage</p>
                      <p className="text-sm font-medium text-foreground">{campaign.stage ?? ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Geography</p>
                      <p className="text-sm font-medium text-foreground">{Array.isArray(campaign.geography) ? campaign.geography.join(', ') : ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Market Size</p>
                      <p className="text-sm font-medium text-foreground">{campaign.data?.market_trends?.market_size ?? 'N/A'}</p>
                    </div>
                  </div>
                  {campaign.data?.executive_summary && (
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-xs font-semibold text-foreground mb-2">Executive Summary</p>
                      <div className="text-muted-foreground">{renderMarkdown(campaign.data.executive_summary)}</div>
                    </div>
                  )}
                  {campaign.emailResults && (
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-xs font-semibold text-foreground mb-2">Email Results</p>
                      <div className="flex gap-3 mb-2">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400">{campaign.emailResults?.total_sent ?? '0'} Sent</span>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-600/20 text-red-400">{campaign.emailResults?.total_failed ?? '0'} Failed</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{campaign.emailResults?.summary ?? ''}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Page ──
export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sampleMode, setSampleMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [researchError, setResearchError] = useState<string | null>(null)
  const [researchData, setResearchData] = useState<CoordinatorResponse | null>(null)
  const [emailResults, setEmailResults] = useState<EmailDeliveryResponse | null>(null)
  const [isSendingEmails, setIsSendingEmails] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [formData, setFormData] = useState<FormData>({
    sector: '',
    stage: '',
    geographies: [],
    investmentMin: '',
    investmentMax: '',
    githubRepos: [''],
    studentFriendly: false,
    valueAddFocus: false,
    localPreferred: false,
  })

  // Load campaigns from localStorage
  useEffect(() => {
    setCampaigns(loadCampaigns())
  }, [])

  // Apply sample data to form when toggled on
  useEffect(() => {
    if (sampleMode) {
      setFormData({
        sector: 'AI/ML',
        stage: 'Seed',
        geographies: ['North America', 'Europe'],
        investmentMin: '500000',
        investmentMax: '3000000',
        githubRepos: ['https://github.com/langchain-ai/langchain', 'https://github.com/joaomdmoura/crewAI'],
        studentFriendly: true,
        valueAddFocus: true,
        localPreferred: false,
      })
      setResearchData(SAMPLE_COORDINATOR_RESPONSE)
    } else {
      setResearchData(null)
      setEmailResults(null)
    }
  }, [sampleMode])

  const handleResearchSubmit = async () => {
    if (sampleMode) {
      setResearchData(SAMPLE_COORDINATOR_RESPONSE)
      setActiveTab('review')
      return
    }

    setIsLoading(true)
    setResearchError(null)
    setResearchData(null)
    setEmailResults(null)
    setActiveAgentId(COORDINATOR_AGENT_ID)

    const prefs: string[] = []
    if (formData.studentFriendly) prefs.push('Student-friendly investors')
    if (formData.valueAddFocus) prefs.push('Value-add focus')
    if (formData.localPreferred) prefs.push('Local investors preferred')

    const repos = formData.githubRepos.filter(r => r.trim() !== '')
    const message = `Research my startup: Sector: ${formData.sector}, Stage: ${formData.stage}, Geography: ${formData.geographies.join(', ')}, Investment range: $${formData.investmentMin || '0'}-$${formData.investmentMax || '0'}, GitHub repos: ${repos.length > 0 ? repos.join(', ') : 'None'}, Preferences: ${prefs.length > 0 ? prefs.join(', ') : 'None'}`

    try {
      const result = await callAIAgent(message, COORDINATOR_AGENT_ID)
      if (result.success) {
        let parsed = result?.response?.result
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed) } catch { /* use as-is */ }
        }
        const coordData = parseCoordinatorResponse(parsed)
        if (coordData) {
          setResearchData(coordData)
          setActiveTab('review')
          // Save as draft campaign
          const newCampaign: Campaign = {
            id: generateId(),
            date: new Date().toISOString(),
            sector: formData.sector,
            stage: formData.stage,
            geography: formData.geographies,
            investorsFound: Array.isArray(coordData?.investor_outreach?.investors) ? coordData.investor_outreach.investors.length : 0,
            emailsSent: 0,
            status: 'Completed',
            data: coordData,
            emailResults: null,
          }
          setCampaigns(prev => {
            const updated = [newCampaign, ...prev]
            saveCampaigns(updated)
            return updated
          })
        } else {
          setResearchError('Received unexpected response format. The data could not be parsed into the expected structure.')
        }
      } else {
        setResearchError(result?.error ?? 'Failed to generate research. Please try again.')
      }
    } catch (err) {
      setResearchError('Network error while generating research. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
      setActiveAgentId(null)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground font-sans flex">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} hasResearchData={researchData !== null} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">
                {activeTab === 'dashboard' && 'Startup Research Dashboard'}
                {activeTab === 'review' && 'Review & Send Outreach'}
                {activeTab === 'history' && 'Campaign History'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              {activeAgentId && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-sidebar-primary/10 border border-sidebar-primary/30 rounded-full">
                  <RiLoader4Line className="w-3.5 h-3.5 text-sidebar-primary animate-spin" />
                  <span className="text-xs font-medium text-sidebar-primary">
                    {activeAgentId === COORDINATOR_AGENT_ID ? 'Research Coordinator' : 'Email Delivery Agent'} working...
                  </span>
                </div>
              )}
              {/* Sample Data Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Sample Data</span>
                <button
                  onClick={() => setSampleMode(prev => !prev)}
                  className={`w-10 h-5 rounded-full flex items-center transition-colors ${sampleMode ? 'bg-sidebar-primary' : 'bg-muted'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${sampleMode ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 max-w-6xl">
            {activeTab === 'dashboard' && (
              <DashboardScreen
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleResearchSubmit}
                isLoading={isLoading}
                error={researchError}
                sampleMode={sampleMode}
              />
            )}
            {activeTab === 'review' && (
              <ReviewScreen
                data={researchData}
                sampleMode={sampleMode}
                emailResults={emailResults}
                setEmailResults={setEmailResults}
                isSendingEmails={isSendingEmails}
                setIsSendingEmails={setIsSendingEmails}
                sendError={sendError}
                setSendError={setSendError}
                activeAgentId={activeAgentId}
                setActiveAgentId={setActiveAgentId}
                campaigns={campaigns}
                setCampaigns={setCampaigns}
                formData={formData}
              />
            )}
            {activeTab === 'history' && (
              <HistoryScreen campaigns={campaigns} />
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
