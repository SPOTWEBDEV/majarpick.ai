// AI Image categories for voting rounds
export const AI_IMAGE_SETS = [
  {
    id: 'set-001',
    theme: 'Scary Creatures',
    images: [
      { id: 1, label: 'Shadow Beast', emoji: '👹', votes: 1423, color: '#ff4757', bg: 'linear-gradient(135deg,#1a0505,#3d0808)', desc: 'Deep shadow entity' },
      { id: 2, label: 'Void Watcher', emoji: '👁️', votes: 2891, color: '#7c3aed', bg: 'linear-gradient(135deg,#0d0820,#1e1040)', desc: 'Ancient eye of void' },
      { id: 3, label: 'Bone Crawler', emoji: '💀', votes: 987, color: '#94a3b8', bg: 'linear-gradient(135deg,#0a0a0f,#1a1a25)', desc: 'Skeleton horror' },
    ]
  },
  {
    id: 'set-002',
    theme: 'Dark Monsters',
    images: [
      { id: 1, label: 'Feral Demon', emoji: '😈', votes: 3102, color: '#ff6b35', bg: 'linear-gradient(135deg,#1a0800,#3d1500)', desc: 'Hellfire demon' },
      { id: 2, label: 'Sea Horror', emoji: '🐙', votes: 1756, color: '#06b6d4', bg: 'linear-gradient(135deg,#000d14,#001a24)', desc: 'Deep sea terror' },
      { id: 3, label: 'Plague Rat', emoji: '🐀', votes: 892, color: '#84cc16', bg: 'linear-gradient(135deg,#070f00,#0f2000)', desc: 'Disease carrier' },
    ]
  },
  {
    id: 'set-003',
    theme: 'Nightmare Faces',
    images: [
      { id: 1, label: 'Crying Ghost', emoji: '👻', votes: 2341, color: '#e2e8f0', bg: 'linear-gradient(135deg,#0a0a12,#151520)', desc: 'Weeping spirit' },
      { id: 2, label: 'Clown Terror', emoji: '🤡', votes: 4120, color: '#ff0080', bg: 'linear-gradient(135deg,#1a001a,#300030)', desc: 'Nightmare clown' },
      { id: 3, label: 'Witch Elder', emoji: '🧙', votes: 1678, color: '#a78bfa', bg: 'linear-gradient(135deg,#0d0820,#1a1040)', desc: 'Ancient dark witch' },
    ]
  }
]

export const MOCK_USER = {
  id: 1,
  name: 'Alex Johnson',
  username: 'alexj',
  email: 'alex@example.com',
  phone: '+1 555 0123',
  balance: 1247.50,
  totalEarnings: 4830.00,
  totalVotes: 147,
  winRate: 0.62,
  avatar: 'AJ',
  referralCode: 'ALEX2024',
  referrals: 12,
  referralEarnings: 360,
  joinDate: '2024-01-15',
  level: 'Gold',
}

export const MOCK_ROUNDS = [
  { id: 'R047', theme: 'Scary Creatures', status: 'live', prize: 500, participants: 2341, countdown: 240, set: AI_IMAGE_SETS[0], myVote: null },
  { id: 'R046', theme: 'Dark Monsters', status: 'upcoming', prize: 1000, participants: 892, countdown: 3600, set: AI_IMAGE_SETS[1], myVote: null },
  { id: 'R045', theme: 'Nightmare Faces', status: 'ended', prize: 250, participants: 4120, winner: 2, set: AI_IMAGE_SETS[2], myVote: 2 },
  { id: 'R044', theme: 'Scary Creatures', status: 'ended', prize: 750, participants: 3102, winner: 1, set: AI_IMAGE_SETS[0], myVote: 1 },
]

export const MOCK_TRANSACTIONS = [
  { id: 'T001', type: 'deposit', amount: 500, method: 'Bank Transfer', status: 'completed', date: '2024-05-01' },
  { id: 'T002', type: 'withdrawal', amount: 200, method: 'Crypto (USDT)', status: 'completed', date: '2024-05-02' },
  { id: 'T003', type: 'win', amount: 87.50, method: 'Round R045', status: 'completed', date: '2024-05-03' },
  { id: 'T004', type: 'deposit', amount: 100, method: 'Crypto (BTC)', status: 'pending', date: '2024-05-04' },
  { id: 'T005', type: 'withdrawal', amount: 150, method: 'Bank Transfer', status: 'pending', date: '2024-05-05' },
  { id: 'T006', type: 'win', amount: 120.00, method: 'Round R044', status: 'completed', date: '2024-05-06' },
]

export const MOCK_REFERRALS = [
  { name: 'Sarah M.', username: 'sarahm', date: '2024-04-01', status: 'active', earned: 30 },
  { name: 'Jake T.', username: 'jakeT', date: '2024-04-05', status: 'active', earned: 30 },
  { name: 'Priya K.', username: 'priyak', date: '2024-04-10', status: 'inactive', earned: 15 },
  { name: 'Tom B.', username: 'tomb', date: '2024-04-20', status: 'active', earned: 30 },
  { name: 'Lisa N.', username: 'lisan', date: '2024-05-01', status: 'active', earned: 30 },
]

export const MOCK_WINNERS = [
  { name: 'CryptoKing', amount: 500, image: 'Void Watcher', avatar: 'CK', streak: 7 },
  { name: 'StarPlayer', amount: 250, image: 'Clown Terror', avatar: 'SP', streak: 3 },
  { name: 'LuckyAce', amount: 750, image: 'Feral Demon', avatar: 'LA', streak: 5 },
  { name: 'NightHawk', amount: 1000, image: 'Void Watcher', avatar: 'NH', streak: 12 },
  { name: 'VoxMaster', amount: 320, image: 'Clown Terror', avatar: 'VM', streak: 2 },
]

export const TESTIMONIALS = [
  { name: 'Michael R.', text: 'Won $500 in my third voting round! The AI training concept is brilliant and the payouts are instant.', stars: 5, avatar: 'MR' },
  { name: 'Jasmine K.', text: 'Love that I\'m actually helping train AI while earning. The referral bonuses are insane too!', stars: 5, avatar: 'JK' },
  { name: 'Carlos D.', text: 'Earned over $2,000 in referral commissions. Best platform to make passive income from AI.', stars: 4, avatar: 'CD' },
]

export const FAQS = [
  { q: 'How does VoteAI work?', a: 'We show you three AI-generated images in each round. Vote for the one you think most users will also vote for. The most-voted image wins! Everyone who voted for it shares the prize pool proportionally.' },
  { q: 'Why does voting help train AI?', a: 'Your votes help AI researchers understand human preferences — which images feel more realistic, scarier, or more detailed. This data is used to improve AI image generation models. You get paid for your contribution!' },
  { q: 'How are winnings calculated?', a: 'The prize pool is divided among all users who voted for the winning image. For example, if the prize is $500 and 100 people voted for the winner, each gets $5 (minus platform fee).' },
  { q: 'How quickly can I withdraw?', a: 'Crypto withdrawals process within 1 hour. Bank transfers take 1-3 business days.' },
  { q: 'Is VoteAI provably fair?', a: 'Yes! The winning image is determined purely by vote count — the image with the most votes wins. All vote counts are publicly auditable on our transparency page.' },
]

export const ADMIN_USERS = [
  { id: 1, username: 'alexj', email: 'alex@example.com', balance: 1247.50, status: 'active', votes: 147, date: '2024-01-15' },
  { id: 2, username: 'sarahm', email: 'sarah@example.com', balance: 432.00, status: 'active', votes: 89, date: '2024-01-18' },
  { id: 3, username: 'jakeT', email: 'jake@example.com', balance: 89.50, status: 'suspended', votes: 23, date: '2024-02-02' },
  { id: 4, username: 'priyak', email: 'priya@example.com', balance: 2100.00, status: 'active', votes: 312, date: '2024-02-10' },
  { id: 5, username: 'tomb', email: 'tom@example.com', balance: 0.00, status: 'inactive', votes: 5, date: '2024-03-01' },
]

export const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
export const initials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
