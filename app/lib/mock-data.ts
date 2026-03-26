// ---------------------------------------------------------------------------
// Local development mock data
// Set VITE_DEV_AUTH=true in .env.local to use this instead of the API
// ---------------------------------------------------------------------------

export const MOCK_USER = {
  id: 'usr_mock_001',
  googleId: 'google_mock_001',
  email: 'dev@recost.dev',
  name: 'Dev User',
  avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=recost',
  isAdmin: false,
  createdAt: '2025-11-01T00:00:00.000Z',
};

export const MOCK_KEYS = [
  {
    id: 'key_mock_001',
    name: 'production-main',
    key_prefix: 'rct_prod_***8f3a',
    last_used_at: '2026-03-24T14:22:00.000Z',
    created_at: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'key_mock_002',
    name: 'staging-test',
    key_prefix: 'rct_stg_***2b7c',
    last_used_at: '2026-03-20T09:10:00.000Z',
    created_at: '2026-02-14T11:30:00.000Z',
  },
  {
    id: 'key_mock_003',
    name: 'dev-local',
    key_prefix: 'rct_dev_***9d4e',
    last_used_at: null,
    created_at: '2026-03-01T08:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const MOCK_PROJECTS = [
  {
    id: 'proj_mock_001',
    name: 'recost-api',
    description: 'Main backend API with AI provider integrations',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-22T16:45:00.000Z',
    latestScanId: 'scan_001_a',
    summary: { scans: 5, endpoints: 12, callsPerDay: 4820, monthlyCost: 247.85 },
  },
  {
    id: 'proj_mock_002',
    name: 'ml-pipeline',
    description: 'Embedding generation, vector search, and model inference pipeline',
    createdAt: '2026-02-03T08:30:00.000Z',
    updatedAt: '2026-03-23T11:20:00.000Z',
    latestScanId: 'scan_002_a',
    summary: { scans: 4, endpoints: 12, callsPerDay: 8940, monthlyCost: 389.40 },
  },
  {
    id: 'proj_mock_003',
    name: 'customer-portal',
    description: 'Customer-facing SaaS portal with payments, notifications, and AI support chat',
    createdAt: '2026-03-01T12:00:00.000Z',
    updatedAt: '2026-03-21T15:10:00.000Z',
    latestScanId: 'scan_003_a',
    summary: { scans: 3, endpoints: 12, callsPerDay: 3270, monthlyCost: 83.60 },
  },
];

// ---------------------------------------------------------------------------
// Scans — proj_mock_001
// ---------------------------------------------------------------------------

export const MOCK_SCANS_001 = [
  {
    id: 'scan_001_a',
    projectId: 'proj_mock_001',
    createdAt: '2026-03-22T16:45:00.000Z',
    endpointIds: ['ep_001','ep_002','ep_003','ep_004','ep_005','ep_006','ep_007','ep_008','ep_009','ep_010','ep_011','ep_012'],
    suggestionIds: ['sug_001','sug_002','sug_003','sug_004','sug_005'],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 12, totalCallsPerDay: 4820, totalMonthlyCost: 247.85, highRiskCount: 2 },
  },
  {
    id: 'scan_001_b',
    projectId: 'proj_mock_001',
    createdAt: '2026-03-15T09:30:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 11, totalCallsPerDay: 4510, totalMonthlyCost: 231.20, highRiskCount: 3 },
  },
  {
    id: 'scan_001_c',
    projectId: 'proj_mock_001',
    createdAt: '2026-03-08T14:00:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 10, totalCallsPerDay: 4100, totalMonthlyCost: 210.40, highRiskCount: 3 },
  },
  {
    id: 'scan_001_d',
    projectId: 'proj_mock_001',
    createdAt: '2026-02-28T11:15:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 9, totalCallsPerDay: 3880, totalMonthlyCost: 198.10, highRiskCount: 4 },
  },
  {
    id: 'scan_001_e',
    projectId: 'proj_mock_001',
    createdAt: '2026-02-14T08:00:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 8, totalCallsPerDay: 3200, totalMonthlyCost: 164.50, highRiskCount: 4 },
  },
];

// ---------------------------------------------------------------------------
// Scans — proj_mock_002
// ---------------------------------------------------------------------------

export const MOCK_SCANS_002 = [
  {
    id: 'scan_002_a',
    projectId: 'proj_mock_002',
    createdAt: '2026-03-23T11:20:00.000Z',
    endpointIds: ['ep_201','ep_202','ep_203','ep_204','ep_205','ep_206','ep_207','ep_208','ep_209','ep_210','ep_211','ep_212'],
    suggestionIds: ['sug_201','sug_202','sug_203','sug_204','sug_205'],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 12, totalCallsPerDay: 8940, totalMonthlyCost: 389.40, highRiskCount: 3 },
  },
  {
    id: 'scan_002_b',
    projectId: 'proj_mock_002',
    createdAt: '2026-03-16T10:00:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 11, totalCallsPerDay: 8200, totalMonthlyCost: 351.80, highRiskCount: 3 },
  },
  {
    id: 'scan_002_c',
    projectId: 'proj_mock_002',
    createdAt: '2026-03-05T09:00:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 10, totalCallsPerDay: 7600, totalMonthlyCost: 318.20, highRiskCount: 4 },
  },
  {
    id: 'scan_002_d',
    projectId: 'proj_mock_002',
    createdAt: '2026-02-20T14:30:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 8, totalCallsPerDay: 6100, totalMonthlyCost: 260.00, highRiskCount: 4 },
  },
];

// ---------------------------------------------------------------------------
// Scans — proj_mock_003
// ---------------------------------------------------------------------------

export const MOCK_SCANS_003 = [
  {
    id: 'scan_003_a',
    projectId: 'proj_mock_003',
    createdAt: '2026-03-21T15:10:00.000Z',
    endpointIds: ['ep_301','ep_302','ep_303','ep_304','ep_305','ep_306','ep_307','ep_308','ep_309','ep_310','ep_311','ep_312'],
    suggestionIds: ['sug_301','sug_302','sug_303','sug_304','sug_305'],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 12, totalCallsPerDay: 3270, totalMonthlyCost: 83.60, highRiskCount: 2 },
  },
  {
    id: 'scan_003_b',
    projectId: 'proj_mock_003',
    createdAt: '2026-03-12T13:00:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 10, totalCallsPerDay: 2940, totalMonthlyCost: 71.30, highRiskCount: 3 },
  },
  {
    id: 'scan_003_c',
    projectId: 'proj_mock_003',
    createdAt: '2026-03-04T10:00:00.000Z',
    endpointIds: [],
    suggestionIds: [],
    graph: { nodes: [], edges: [] },
    summary: { totalEndpoints: 8, totalCallsPerDay: 2500, totalMonthlyCost: 58.90, highRiskCount: 3 },
  },
];

export const MOCK_SCANS = [...MOCK_SCANS_001, ...MOCK_SCANS_002, ...MOCK_SCANS_003];

export const MOCK_LATEST_SCAN_MAP: Record<string, typeof MOCK_SCANS_001[0]> = {
  'proj_mock_001': MOCK_SCANS_001[0],
  'proj_mock_002': MOCK_SCANS_002[0],
  'proj_mock_003': MOCK_SCANS_003[0],
};

// Keep for backward compat
export const MOCK_LATEST_SCAN = MOCK_SCANS_001[0];

// ---------------------------------------------------------------------------
// Endpoints — proj_mock_001 (recost-api)
// ---------------------------------------------------------------------------

export const MOCK_ENDPOINTS_001 = [
  {
    id: 'ep_001', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'OpenAI', method: 'POST', url: 'https://api.openai.com/v1/chat/completions',
    methodSignature: 'openai.chat.completions.create()',
    files: ['src/services/ai.ts', 'src/workers/review-worker.ts'],
    callSites: [
      { file: 'src/services/ai.ts', line: 42, library: 'openai', frequencyClass: 'unbounded-loop' },
      { file: 'src/workers/review-worker.ts', line: 17, library: 'openai', frequencyClass: 'parallel', crossFileOrigin: { file: 'src/services/ai.ts', functionName: 'generateReview' } },
    ],
    callsPerDay: 1200, monthlyCost: 98.50, status: 'n_plus_one_risk',
    scope: 'external', frequencyClass: 'unbounded-loop',
    costModel: { model: 'per_token', perCallCost: 0.002 }, streaming: true,
    crossFileOrigins: [{ file: 'src/services/ai.ts', functionName: 'generateReview' }],
  },
  {
    id: 'ep_002', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'Anthropic', method: 'POST', url: 'https://api.anthropic.com/v1/messages',
    methodSignature: 'anthropic.messages.create()',
    files: ['src/services/claude.ts'],
    callSites: [{ file: 'src/services/claude.ts', line: 18, library: '@anthropic-ai/sdk', frequencyClass: 'conditional' }],
    callsPerDay: 450, monthlyCost: 67.20, status: 'normal',
    scope: 'external', frequencyClass: 'conditional',
    costModel: { model: 'per_token', perCallCost: 0.006 }, streaming: true,
  },
  {
    id: 'ep_003', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'OpenAI', method: 'POST', url: 'https://api.openai.com/v1/embeddings',
    methodSignature: 'openai.embeddings.create()',
    files: ['src/services/search.ts', 'src/workers/index-worker.ts'],
    callSites: [
      { file: 'src/services/search.ts', line: 91, library: 'openai', frequencyClass: 'polling' },
      { file: 'src/workers/index-worker.ts', line: 34, library: 'openai', frequencyClass: 'bounded-loop' },
    ],
    callsPerDay: 540, monthlyCost: 59.05, status: 'rate_limit_risk',
    scope: 'external', frequencyClass: 'polling',
    costModel: { model: 'per_token', perCallCost: 0.0001 }, batchCapable: true,
    crossFileOrigins: [{ file: 'src/services/search.ts', functionName: 'indexDocuments' }],
  },
  {
    id: 'ep_004', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'Cohere', method: 'POST', url: 'https://api.cohere.ai/v1/generate',
    methodSignature: 'cohere.generate()',
    files: ['src/services/summarise.ts'],
    callSites: [{ file: 'src/services/summarise.ts', line: 33, library: 'cohere-ai', frequencyClass: 'bounded-loop' }],
    callsPerDay: 230, monthlyCost: 23.10, status: 'batchable',
    scope: 'external', frequencyClass: 'bounded-loop',
    costModel: { model: 'per_token' }, batchCapable: true,
  },
  {
    id: 'ep_005', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'Stripe', method: 'GET', url: 'https://api.stripe.com/v1/customers',
    methodSignature: 'stripe.customers.list()',
    files: ['src/billing/customers.ts'],
    callSites: [{ file: 'src/billing/customers.ts', line: 57, library: 'stripe', frequencyClass: 'parallel' }],
    callsPerDay: 890, monthlyCost: 0, status: 'cacheable',
    scope: 'external', frequencyClass: 'parallel',
    costModel: { model: 'free' }, cacheCapable: true,
  },
  {
    id: 'ep_006', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'Stripe', method: 'POST', url: 'https://api.stripe.com/v1/charges',
    methodSignature: 'stripe.charges.create()',
    files: ['src/billing/payments.ts'],
    callSites: [{ file: 'src/billing/payments.ts', line: 14, library: 'stripe', frequencyClass: 'single' }],
    callsPerDay: 320, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'per_transaction' },
  },
  {
    id: 'ep_007', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'GitHub', method: 'GET', url: 'https://api.github.com/repos/{owner}/{repo}/commits',
    files: ['src/integrations/github.ts'],
    callSites: [{ file: 'src/integrations/github.ts', line: 22, library: 'octokit', frequencyClass: 'cache-guarded' }],
    callsPerDay: 780, monthlyCost: 0, status: 'redundant',
    scope: 'external', frequencyClass: 'cache-guarded',
    costModel: { model: 'free' }, cacheCapable: true,
  },
  {
    id: 'ep_008', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'Anthropic', method: 'POST', url: 'https://api.anthropic.com/v1/complete',
    methodSignature: 'anthropic.completions.create()',
    files: ['src/services/legacy-claude.ts'],
    callSites: [{ file: 'src/services/legacy-claude.ts', line: 8, library: '@anthropic-ai/sdk', frequencyClass: 'conditional' }],
    callsPerDay: 230, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'conditional',
    costModel: { model: 'per_token' },
  },
  {
    id: 'ep_009', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'SendGrid', method: 'GET', url: 'https://api.sendgrid.com/v3/stats',
    files: ['src/notifications/email.ts'],
    callSites: [{ file: 'src/notifications/email.ts', line: 77, library: '@sendgrid/mail', frequencyClass: 'single' }],
    callsPerDay: 180, monthlyCost: 0, status: 'redundant',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'free' },
  },
  {
    id: 'ep_010', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'OpenAI', method: 'GET', url: 'https://api.openai.com/v1/models',
    methodSignature: 'openai.models.list()',
    files: ['src/config/providers.ts'],
    callSites: [{ file: 'src/config/providers.ts', line: 5, library: 'openai', frequencyClass: 'cache-guarded' }],
    callsPerDay: 340, monthlyCost: 0, status: 'cacheable',
    scope: 'external', frequencyClass: 'cache-guarded',
    costModel: { model: 'free' }, cacheCapable: true,
  },
  {
    id: 'ep_011', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'Stripe', method: 'PATCH', url: 'https://api.stripe.com/v1/customers/{id}',
    methodSignature: 'stripe.customers.update()',
    files: ['src/billing/customers.ts'],
    callSites: [{ file: 'src/billing/customers.ts', line: 103, library: 'stripe', frequencyClass: 'single' }],
    callsPerDay: 155, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'per_request' },
  },
  {
    id: 'ep_012', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    provider: 'Stripe', method: 'DELETE', url: 'https://api.stripe.com/v1/customers/{id}',
    methodSignature: 'stripe.customers.del()',
    files: ['src/billing/customers.ts'],
    callSites: [{ file: 'src/billing/customers.ts', line: 128, library: 'stripe', frequencyClass: 'single' }],
    callsPerDay: 45, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'per_request' },
  },
];

// ---------------------------------------------------------------------------
// Endpoints — proj_mock_002 (ml-pipeline)
// ---------------------------------------------------------------------------

export const MOCK_ENDPOINTS_002 = [
  {
    id: 'ep_201', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'OpenAI', method: 'POST', url: 'https://api.openai.com/v1/embeddings',
    methodSignature: 'openai.embeddings.create()',
    files: ['src/pipeline/embed.ts', 'src/pipeline/ingest.ts', 'src/workers/chunk-worker.ts'],
    callSites: [
      { file: 'src/pipeline/embed.ts', line: 28, library: 'openai', frequencyClass: 'unbounded-loop' },
      { file: 'src/pipeline/ingest.ts', line: 64, library: 'openai', frequencyClass: 'unbounded-loop', crossFileOrigin: { file: 'src/pipeline/embed.ts', functionName: 'embedChunks' } },
      { file: 'src/workers/chunk-worker.ts', line: 11, library: 'openai', frequencyClass: 'parallel' },
    ],
    callsPerDay: 4200, monthlyCost: 189.00, status: 'n_plus_one_risk',
    scope: 'external', frequencyClass: 'unbounded-loop',
    costModel: { model: 'per_token', perCallCost: 0.00013 }, batchCapable: true,
    crossFileOrigins: [
      { file: 'src/pipeline/embed.ts', functionName: 'embedChunks' },
      { file: 'src/pipeline/ingest.ts', functionName: 'ingestDocuments' },
    ],
  },
  {
    id: 'ep_202', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'OpenAI', method: 'POST', url: 'https://api.openai.com/v1/chat/completions',
    methodSignature: 'openai.chat.completions.create()',
    files: ['src/labeling/auto-label.ts'],
    callSites: [
      { file: 'src/labeling/auto-label.ts', line: 55, library: 'openai', frequencyClass: 'bounded-loop' },
    ],
    callsPerDay: 820, monthlyCost: 74.80, status: 'batchable',
    scope: 'external', frequencyClass: 'bounded-loop',
    costModel: { model: 'per_token', perCallCost: 0.003 }, batchCapable: true,
  },
  {
    id: 'ep_203', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'OpenAI', method: 'POST', url: 'https://api.openai.com/v1/fine_tuning/jobs',
    methodSignature: 'openai.fineTuning.jobs.create()',
    files: ['src/training/fine-tune.ts'],
    callSites: [{ file: 'src/training/fine-tune.ts', line: 14, library: 'openai', frequencyClass: 'single' }],
    callsPerDay: 2, monthlyCost: 42.60, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'per_token', perCallCost: 8.00 },
  },
  {
    id: 'ep_204', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'Cohere', method: 'POST', url: 'https://api.cohere.ai/v1/rerank',
    methodSignature: 'cohere.rerank()',
    files: ['src/search/rerank.ts'],
    callSites: [{ file: 'src/search/rerank.ts', line: 38, library: 'cohere-ai', frequencyClass: 'bounded-loop' }],
    callsPerDay: 960, monthlyCost: 28.80, status: 'batchable',
    scope: 'external', frequencyClass: 'bounded-loop',
    costModel: { model: 'per_request', perCallCost: 0.001 }, batchCapable: true,
  },
  {
    id: 'ep_205', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'Cohere', method: 'POST', url: 'https://api.cohere.ai/v1/generate',
    methodSignature: 'cohere.generate()',
    files: ['src/pipeline/summarise.ts'],
    callSites: [{ file: 'src/pipeline/summarise.ts', line: 22, library: 'cohere-ai', frequencyClass: 'conditional' }],
    callsPerDay: 340, monthlyCost: 17.00, status: 'normal',
    scope: 'external', frequencyClass: 'conditional',
    costModel: { model: 'per_token', perCallCost: 0.0015 },
  },
  {
    id: 'ep_206', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'Pinecone', method: 'POST', url: 'https://{index}.svc.pinecone.io/vectors/upsert',
    methodSignature: 'index.upsert()',
    files: ['src/vector/store.ts', 'src/pipeline/embed.ts'],
    callSites: [
      { file: 'src/vector/store.ts', line: 17, library: '@pinecone-database/pinecone', frequencyClass: 'bounded-loop' },
      { file: 'src/pipeline/embed.ts', line: 72, library: '@pinecone-database/pinecone', frequencyClass: 'parallel', crossFileOrigin: { file: 'src/vector/store.ts', functionName: 'upsertBatch' } },
    ],
    callsPerDay: 1400, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'bounded-loop',
    costModel: { model: 'per_request' },
    crossFileOrigins: [{ file: 'src/vector/store.ts', functionName: 'upsertBatch' }],
  },
  {
    id: 'ep_207', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'Pinecone', method: 'POST', url: 'https://{index}.svc.pinecone.io/query',
    methodSignature: 'index.query()',
    files: ['src/search/semantic-search.ts'],
    callSites: [
      { file: 'src/search/semantic-search.ts', line: 43, library: '@pinecone-database/pinecone', frequencyClass: 'parallel' },
    ],
    callsPerDay: 680, monthlyCost: 0, status: 'cacheable',
    scope: 'external', frequencyClass: 'parallel',
    costModel: { model: 'per_request' }, cacheCapable: true,
  },
  {
    id: 'ep_208', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'HuggingFace', method: 'POST', url: 'https://api-inference.huggingface.co/models/{model}',
    methodSignature: 'hf.textClassification()',
    files: ['src/labeling/classifier.ts'],
    callSites: [{ file: 'src/labeling/classifier.ts', line: 31, library: '@huggingface/inference', frequencyClass: 'bounded-loop' }],
    callsPerDay: 520, monthlyCost: 15.60, status: 'rate_limit_risk',
    scope: 'external', frequencyClass: 'bounded-loop',
    costModel: { model: 'per_request', perCallCost: 0.001 },
  },
  {
    id: 'ep_209', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'AWS S3', method: 'GET', url: 'https://s3.amazonaws.com/{bucket}/{key}',
    files: ['src/storage/s3.ts', 'src/pipeline/ingest.ts'],
    callSites: [
      { file: 'src/storage/s3.ts', line: 9, library: '@aws-sdk/client-s3', frequencyClass: 'bounded-loop' },
      { file: 'src/pipeline/ingest.ts', line: 31, library: '@aws-sdk/client-s3', frequencyClass: 'bounded-loop', crossFileOrigin: { file: 'src/storage/s3.ts', functionName: 'fetchObject' } },
    ],
    callsPerDay: 1800, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'bounded-loop',
    costModel: { model: 'free' },
    crossFileOrigins: [{ file: 'src/storage/s3.ts', functionName: 'fetchObject' }],
  },
  {
    id: 'ep_210', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'AWS SQS', method: 'GET', url: 'https://sqs.{region}.amazonaws.com/{queue}',
    methodSignature: 'sqs.receiveMessage()',
    files: ['src/workers/queue-consumer.ts'],
    callSites: [{ file: 'src/workers/queue-consumer.ts', line: 7, library: '@aws-sdk/client-sqs', frequencyClass: 'polling' }],
    callsPerDay: 2880, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'polling',
    costModel: { model: 'free' },
  },
  {
    id: 'ep_211', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'OpenAI', method: 'POST', url: 'https://api.openai.com/v1/batches',
    methodSignature: 'openai.batches.create()',
    files: ['src/pipeline/batch-embed.ts'],
    callSites: [{ file: 'src/pipeline/batch-embed.ts', line: 19, library: 'openai', frequencyClass: 'single' }],
    callsPerDay: 12, monthlyCost: 21.60, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'per_token', perCallCost: 0.00007 }, batchCapable: false,
  },
  {
    id: 'ep_212', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    provider: 'Anthropic', method: 'POST', url: 'https://api.anthropic.com/v1/messages',
    methodSignature: 'anthropic.messages.create()',
    files: ['src/qa/quality-check.ts'],
    callSites: [{ file: 'src/qa/quality-check.ts', line: 44, library: '@anthropic-ai/sdk', frequencyClass: 'conditional' }],
    callsPerDay: 160, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'conditional',
    costModel: { model: 'per_token', perCallCost: 0.005 },
  },
];

// ---------------------------------------------------------------------------
// Endpoints — proj_mock_003 (customer-portal)
// ---------------------------------------------------------------------------

export const MOCK_ENDPOINTS_003 = [
  {
    id: 'ep_301', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'OpenAI', method: 'POST', url: 'https://api.openai.com/v1/chat/completions',
    methodSignature: 'openai.chat.completions.create()',
    files: ['src/support/chat.ts'],
    callSites: [{ file: 'src/support/chat.ts', line: 38, library: 'openai', frequencyClass: 'single' }],
    callsPerDay: 640, monthlyCost: 58.24, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'per_token', perCallCost: 0.003 }, streaming: true,
  },
  {
    id: 'ep_302', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'Stripe', method: 'POST', url: 'https://api.stripe.com/v1/payment_intents',
    methodSignature: 'stripe.paymentIntents.create()',
    files: ['src/checkout/payment.ts'],
    callSites: [{ file: 'src/checkout/payment.ts', line: 22, library: 'stripe', frequencyClass: 'single' }],
    callsPerDay: 480, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'per_transaction' },
  },
  {
    id: 'ep_303', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'Stripe', method: 'GET', url: 'https://api.stripe.com/v1/customers/{id}',
    methodSignature: 'stripe.customers.retrieve()',
    files: ['src/auth/middleware.ts', 'src/billing/portal.ts', 'src/support/chat.ts'],
    callSites: [
      { file: 'src/auth/middleware.ts', line: 14, library: 'stripe', frequencyClass: 'unbounded-loop' },
      { file: 'src/billing/portal.ts', line: 29, library: 'stripe', frequencyClass: 'single' },
      { file: 'src/support/chat.ts', line: 12, library: 'stripe', frequencyClass: 'conditional', crossFileOrigin: { file: 'src/auth/middleware.ts', functionName: 'getCustomer' } },
    ],
    callsPerDay: 1840, monthlyCost: 0, status: 'n_plus_one_risk',
    scope: 'external', frequencyClass: 'unbounded-loop',
    costModel: { model: 'free' }, cacheCapable: true,
    crossFileOrigins: [{ file: 'src/auth/middleware.ts', functionName: 'getCustomer' }],
  },
  {
    id: 'ep_304', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'Stripe', method: 'GET', url: 'https://api.stripe.com/v1/subscriptions',
    methodSignature: 'stripe.subscriptions.list()',
    files: ['src/billing/portal.ts', 'src/dashboard/overview.ts'],
    callSites: [
      { file: 'src/billing/portal.ts', line: 54, library: 'stripe', frequencyClass: 'single' },
      { file: 'src/dashboard/overview.ts', line: 18, library: 'stripe', frequencyClass: 'single' },
    ],
    callsPerDay: 620, monthlyCost: 0, status: 'redundant',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'free' }, cacheCapable: true,
    crossFileOrigins: [],
  },
  {
    id: 'ep_305', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'Stripe', method: 'GET', url: 'https://api.stripe.com/v1/prices',
    methodSignature: 'stripe.prices.list()',
    files: ['src/pages/pricing.ts'],
    callSites: [{ file: 'src/pages/pricing.ts', line: 7, library: 'stripe', frequencyClass: 'cache-guarded' }],
    callsPerDay: 420, monthlyCost: 0, status: 'cacheable',
    scope: 'external', frequencyClass: 'cache-guarded',
    costModel: { model: 'free' }, cacheCapable: true,
  },
  {
    id: 'ep_306', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'Stripe', method: 'GET', url: 'https://api.stripe.com/v1/invoices',
    methodSignature: 'stripe.invoices.list()',
    files: ['src/billing/history.ts'],
    callSites: [{ file: 'src/billing/history.ts', line: 33, library: 'stripe', frequencyClass: 'conditional' }],
    callsPerDay: 290, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'conditional',
    costModel: { model: 'free' },
  },
  {
    id: 'ep_307', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'Twilio', method: 'POST', url: 'https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json',
    methodSignature: 'client.messages.create()',
    files: ['src/notifications/sms.ts'],
    callSites: [{ file: 'src/notifications/sms.ts', line: 18, library: 'twilio', frequencyClass: 'conditional' }],
    callsPerDay: 310, monthlyCost: 15.50, status: 'normal',
    scope: 'external', frequencyClass: 'conditional',
    costModel: { model: 'per_request', perCallCost: 0.0079 },
  },
  {
    id: 'ep_308', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'Twilio', method: 'GET', url: 'https://lookups.twilio.com/v2/PhoneNumbers/{number}',
    methodSignature: 'client.lookups.v2.phoneNumbers(number).fetch()',
    files: ['src/auth/phone-verify.ts'],
    callSites: [{ file: 'src/auth/phone-verify.ts', line: 26, library: 'twilio', frequencyClass: 'single' }],
    callsPerDay: 185, monthlyCost: 9.25, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'per_request', perCallCost: 0.005 },
  },
  {
    id: 'ep_309', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'SendGrid', method: 'POST', url: 'https://api.sendgrid.com/v3/mail/send',
    files: ['src/notifications/email.ts', 'src/auth/welcome.ts'],
    callSites: [
      { file: 'src/notifications/email.ts', line: 14, library: '@sendgrid/mail', frequencyClass: 'conditional' },
      { file: 'src/auth/welcome.ts', line: 9, library: '@sendgrid/mail', frequencyClass: 'single', crossFileOrigin: { file: 'src/notifications/email.ts', functionName: 'sendTransactional' } },
    ],
    callsPerDay: 520, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'conditional',
    costModel: { model: 'free' },
    crossFileOrigins: [{ file: 'src/notifications/email.ts', functionName: 'sendTransactional' }],
  },
  {
    id: 'ep_310', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'SendGrid', method: 'GET', url: 'https://api.sendgrid.com/v3/suppression/unsubscribes',
    files: ['src/notifications/email.ts'],
    callSites: [{ file: 'src/notifications/email.ts', line: 61, library: '@sendgrid/mail', frequencyClass: 'bounded-loop' }],
    callsPerDay: 520, monthlyCost: 0, status: 'batchable',
    scope: 'external', frequencyClass: 'bounded-loop',
    costModel: { model: 'free' }, batchCapable: true,
  },
  {
    id: 'ep_311', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'Stripe', method: 'GET', url: 'https://api.stripe.com/v1/products',
    methodSignature: 'stripe.products.list()',
    files: ['src/pages/pricing.ts'],
    callSites: [{ file: 'src/pages/pricing.ts', line: 19, library: 'stripe', frequencyClass: 'cache-guarded' }],
    callsPerDay: 420, monthlyCost: 0, status: 'cacheable',
    scope: 'external', frequencyClass: 'cache-guarded',
    costModel: { model: 'free' }, cacheCapable: true,
  },
  {
    id: 'ep_312', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    provider: 'OpenAI', method: 'POST', url: 'https://api.openai.com/v1/moderations',
    methodSignature: 'openai.moderations.create()',
    files: ['src/support/chat.ts'],
    callSites: [{ file: 'src/support/chat.ts', line: 21, library: 'openai', frequencyClass: 'single' }],
    callsPerDay: 640, monthlyCost: 0, status: 'normal',
    scope: 'external', frequencyClass: 'single',
    costModel: { model: 'free' },
  },
];

export const MOCK_ENDPOINTS = [...MOCK_ENDPOINTS_001, ...MOCK_ENDPOINTS_002, ...MOCK_ENDPOINTS_003];

export const MOCK_ENDPOINTS_MAP: Record<string, typeof MOCK_ENDPOINTS_001> = {
  'proj_mock_001': MOCK_ENDPOINTS_001,
  'proj_mock_002': MOCK_ENDPOINTS_002,
  'proj_mock_003': MOCK_ENDPOINTS_003,
};

// ---------------------------------------------------------------------------
// Suggestions — proj_mock_001 (recost-api)
// ---------------------------------------------------------------------------

export const MOCK_SUGGESTIONS_001 = [
  {
    id: 'sug_001', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    type: 'n_plus_one', severity: 'high',
    affectedEndpoints: ['ep_001'],
    affectedFiles: ['src/services/ai.ts'],
    estimatedMonthlySavings: 42.30,
    description: 'chat/completions is called in a loop across review-worker — batch requests or cache repeated prompts to reduce call volume by ~60%',
    codeFix: '// Before\nfor (const item of items) {\n  await openai.chat.completions.create({ messages: [...] });\n}\n\n// After\nconst results = await Promise.all(\n  chunk(items, 20).map(batch =>\n    openai.chat.completions.create({ messages: batch })\n  )\n);',
  },
  {
    id: 'sug_002', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    type: 'rate_limit', severity: 'high',
    affectedEndpoints: ['ep_003'],
    affectedFiles: ['src/services/search.ts'],
    estimatedMonthlySavings: 18.75,
    description: 'Embeddings endpoint is called at high frequency without retry logic — add exponential backoff and a request queue to avoid 429s under load',
    codeFix: '// Add a queue with rate limiting\nimport PQueue from "p-queue";\nconst queue = new PQueue({ interval: 60_000, intervalCap: 3000 });\n\nexport const embed = (text: string) =>\n  queue.add(() =>\n    openai.embeddings.create({ input: text, model: "text-embedding-3-small" })\n  );',
  },
  {
    id: 'sug_003', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    type: 'cache', severity: 'medium',
    affectedEndpoints: ['ep_005', 'ep_010'],
    affectedFiles: ['src/billing/customers.ts', 'src/config/providers.ts'],
    estimatedMonthlySavings: 12.40,
    description: 'GET /customers and GET /models responses are stable — cache with a short TTL to cut 1,230 redundant calls/day',
    codeFix: '// Cache customer list for 60s\nconst customers = await cache.getOrSet(\n  "stripe:customers",\n  () => stripe.customers.list(),\n  { ttl: 60 }\n);',
  },
  {
    id: 'sug_004', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    type: 'batch', severity: 'medium',
    affectedEndpoints: ['ep_004'],
    affectedFiles: ['src/services/summarise.ts'],
    estimatedMonthlySavings: 8.20,
    description: 'Cohere generate is called once per document — use the batch API to process up to 96 texts per request and halve latency',
    codeFix: '// Before: one call per doc\nfor (const doc of docs) {\n  await cohere.generate({ prompt: doc });\n}\n\n// After: batched\nawait cohere.batch.generate({ prompts: docs });',
  },
  {
    id: 'sug_005', projectId: 'proj_mock_001', scanId: 'scan_001_a',
    type: 'redundancy', severity: 'low',
    affectedEndpoints: ['ep_007', 'ep_009'],
    affectedFiles: ['src/integrations/github.ts', 'src/notifications/email.ts'],
    estimatedMonthlySavings: 3.10,
    description: 'GET /commits and GET /stats are called from 3 different modules with identical parameters — deduplicate with a shared fetch layer',
    codeFix: '// Centralise in a shared provider module\nimport { githubClient } from "@/lib/github";\nconst commits = await githubClient.getCommits(owner, repo); // cached internally',
  },
];

// ---------------------------------------------------------------------------
// Suggestions — proj_mock_002 (ml-pipeline)
// ---------------------------------------------------------------------------

export const MOCK_SUGGESTIONS_002 = [
  {
    id: 'sug_201', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    type: 'n_plus_one', severity: 'high',
    affectedEndpoints: ['ep_201'],
    affectedFiles: ['src/pipeline/embed.ts', 'src/pipeline/ingest.ts'],
    estimatedMonthlySavings: 94.50,
    description: 'embeddings.create() is called once per chunk across three call sites — switch to the Batch API for up to 50% cost reduction on text-embedding-3-large at current volume',
    codeFix: '// Before — one call per chunk\nfor (const chunk of chunks) {\n  const res = await openai.embeddings.create({\n    model: "text-embedding-3-large",\n    input: chunk,\n  });\n  vectors.push(res.data[0].embedding);\n}\n\n// After — batched (up to 2048 inputs per call)\nconst res = await openai.embeddings.create({\n  model: "text-embedding-3-large",\n  input: chunks,          // array of strings\n  encoding_format: "float",\n});\nconst vectors = res.data.map(d => d.embedding);',
  },
  {
    id: 'sug_202', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    type: 'rate_limit', severity: 'high',
    affectedEndpoints: ['ep_208'],
    affectedFiles: ['src/labeling/classifier.ts'],
    estimatedMonthlySavings: 6.20,
    description: 'HuggingFace inference is called at 520 req/day with no retry or back-pressure — at this volume, bursts during ingestion will hit rate limits',
    codeFix: '// Wrap with exponential backoff\nimport retry from "async-retry";\n\nexport const classify = (text: string) =>\n  retry(\n    () => hf.textClassification({ model: "distilbert-base-uncased", inputs: text }),\n    { retries: 4, factor: 2, minTimeout: 500 }\n  );',
  },
  {
    id: 'sug_203', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    type: 'cache', severity: 'medium',
    affectedEndpoints: ['ep_207'],
    affectedFiles: ['src/search/semantic-search.ts'],
    estimatedMonthlySavings: 0,
    description: 'Pinecone query results for identical embedding vectors are re-fetched on every request — a short TTL cache on the query hash would eliminate ~40% of redundant lookups',
    codeFix: '// Cache query results by vector hash\nimport { createHash } from "crypto";\n\nconst queryHash = createHash("sha256")\n  .update(JSON.stringify(vector))\n  .digest("hex");\n\nconst results = await cache.getOrSet(\n  `pinecone:${queryHash}`,\n  () => index.query({ vector, topK: 10 }),\n  { ttl: 300 } // 5 min\n);',
  },
  {
    id: 'sug_204', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    type: 'batch', severity: 'medium',
    affectedEndpoints: ['ep_202'],
    affectedFiles: ['src/labeling/auto-label.ts'],
    estimatedMonthlySavings: 37.40,
    description: 'auto-label.ts calls chat/completions once per document — use OpenAI Batch API (50% discount) for non-realtime labeling jobs that tolerate 24h turnaround',
    codeFix: '// Instead of realtime completions, create a batch job\nconst batch = await openai.batches.create({\n  input_file_id: await uploadBatchFile(docs),\n  endpoint: "/v1/chat/completions",\n  completion_window: "24h",\n});\n// Poll or use webhook for results',
  },
  {
    id: 'sug_205', projectId: 'proj_mock_002', scanId: 'scan_002_a',
    type: 'redundancy', severity: 'low',
    affectedEndpoints: ['ep_209'],
    affectedFiles: ['src/storage/s3.ts', 'src/pipeline/ingest.ts'],
    estimatedMonthlySavings: 0,
    description: 'S3 getObject is called from both storage.ts and ingest.ts for the same keys — consolidate fetches at the pipeline entry point to avoid duplicate bandwidth costs',
    codeFix: '// Fetch once at the pipeline boundary\nconst raw = await s3.getObject({ Bucket, Key }).promise();\n// Pass the buffer downstream instead of re-fetching\nawait ingest(raw.Body);',
  },
];

// ---------------------------------------------------------------------------
// Suggestions — proj_mock_003 (customer-portal)
// ---------------------------------------------------------------------------

export const MOCK_SUGGESTIONS_003 = [
  {
    id: 'sug_301', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    type: 'cache', severity: 'high',
    affectedEndpoints: ['ep_305', 'ep_311'],
    affectedFiles: ['src/pages/pricing.ts'],
    estimatedMonthlySavings: 0,
    description: 'Stripe prices and products are fetched on every pricing page load (840 calls/day combined) — these change at most once a month and are ideal candidates for CDN-level or server-side caching',
    codeFix: '// Cache at the edge (Next.js example)\nexport const revalidate = 3600; // 1 hour ISR\n\n// Or explicitly with Redis\nconst prices = await cache.getOrSet(\n  "stripe:prices",\n  () => stripe.prices.list({ active: true }),\n  { ttl: 3600 }\n);',
  },
  {
    id: 'sug_302', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    type: 'n_plus_one', severity: 'high',
    affectedEndpoints: ['ep_303'],
    affectedFiles: ['src/auth/middleware.ts'],
    estimatedMonthlySavings: 0,
    description: 'stripe.customers.retrieve() is called on every authenticated request from auth middleware — this adds a Stripe round-trip to every API call. Cache the customer object per session or store denormalised data locally',
    codeFix: '// Attach customer to session at login, not on every request\n// auth/login.ts\nconst customer = await stripe.customers.retrieve(stripeId);\nreq.session.stripeCustomer = customer;\nawait req.session.save();\n\n// middleware.ts — read from session, no Stripe call\nconst customer = req.session.stripeCustomer;',
  },
  {
    id: 'sug_303', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    type: 'redundancy', severity: 'medium',
    affectedEndpoints: ['ep_304'],
    affectedFiles: ['src/billing/portal.ts', 'src/dashboard/overview.ts'],
    estimatedMonthlySavings: 0,
    description: 'stripe.subscriptions.list() is called independently from billing/portal.ts and dashboard/overview.ts on the same page load — deduplicate with a shared data-fetching layer or a single SSR fetch',
    codeFix: '// Shared server loader (e.g. React Router loader)\nexport async function loader({ params }) {\n  const [subscriptions, invoices] = await Promise.all([\n    stripe.subscriptions.list({ customer: params.id }),\n    stripe.invoices.list({ customer: params.id }),\n  ]);\n  return { subscriptions, invoices };\n}',
  },
  {
    id: 'sug_304', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    type: 'batch', severity: 'medium',
    affectedEndpoints: ['ep_310'],
    affectedFiles: ['src/notifications/email.ts'],
    estimatedMonthlySavings: 0,
    description: 'SendGrid suppression check is called once per recipient in a loop before sending — use the GET /v3/suppression/blocks endpoint with a comma-separated list to batch the check',
    codeFix: '// Before: one check per recipient\nfor (const email of recipients) {\n  const blocked = await sg.suppressions.get(email);\n  if (!blocked) queue.push(email);\n}\n\n// After: single batch check\nconst blocked = new Set(\n  await sg.suppressions.getAll({ email: recipients.join(",") })\n);\nconst queue = recipients.filter(e => !blocked.has(e));',
  },
  {
    id: 'sug_305', projectId: 'proj_mock_003', scanId: 'scan_003_a',
    type: 'redundancy', severity: 'low',
    affectedEndpoints: ['ep_307', 'ep_308'],
    affectedFiles: ['src/notifications/sms.ts', 'src/auth/phone-verify.ts'],
    estimatedMonthlySavings: 0,
    description: 'Twilio Lookup is called on every SMS send to validate the number, even for numbers already verified at signup — store the validated status to skip the lookup on repeat sends',
    codeFix: '// Store validation result at signup\nawait db.user.update({ where: { id }, data: { phoneVerified: true } });\n\n// Skip lookup for verified numbers\nif (!user.phoneVerified) {\n  await client.lookups.v2.phoneNumbers(phone).fetch();\n}',
  },
];

export const MOCK_SUGGESTIONS = [...MOCK_SUGGESTIONS_001, ...MOCK_SUGGESTIONS_002, ...MOCK_SUGGESTIONS_003];

export const MOCK_SUGGESTIONS_MAP: Record<string, typeof MOCK_SUGGESTIONS_001> = {
  'proj_mock_001': MOCK_SUGGESTIONS_001,
  'proj_mock_002': MOCK_SUGGESTIONS_002,
  'proj_mock_003': MOCK_SUGGESTIONS_003,
};

// ---------------------------------------------------------------------------
// Cost by provider
// ---------------------------------------------------------------------------

export const MOCK_COST_BY_PROVIDER_MAP: Record<string, { provider: string; monthlyCost: number; callsPerDay: number; endpointCount: number }[]> = {
  'proj_mock_001': [
    { provider: 'OpenAI',    monthlyCost: 157.55, callsPerDay: 2080, endpointCount: 3 },
    { provider: 'Anthropic', monthlyCost:  67.20, callsPerDay:  680, endpointCount: 2 },
    { provider: 'Cohere',    monthlyCost:  23.10, callsPerDay:  230, endpointCount: 1 },
    { provider: 'Stripe',    monthlyCost:   0,    callsPerDay: 1410, endpointCount: 4 },
    { provider: 'GitHub',    monthlyCost:   0,    callsPerDay:  780, endpointCount: 1 },
    { provider: 'SendGrid',  monthlyCost:   0,    callsPerDay:  180, endpointCount: 1 },
  ],
  'proj_mock_002': [
    { provider: 'OpenAI',      monthlyCost: 328.00, callsPerDay: 5034, endpointCount: 4 },
    { provider: 'Cohere',      monthlyCost:  45.80, callsPerDay: 1300, endpointCount: 2 },
    { provider: 'HuggingFace', monthlyCost:  15.60, callsPerDay:  520, endpointCount: 1 },
    { provider: 'Anthropic',   monthlyCost:   0,    callsPerDay:  160, endpointCount: 1 },
    { provider: 'Pinecone',    monthlyCost:   0,    callsPerDay: 2080, endpointCount: 2 },
    { provider: 'AWS S3',      monthlyCost:   0,    callsPerDay: 1800, endpointCount: 1 },
    { provider: 'AWS SQS',     monthlyCost:   0,    callsPerDay: 2880, endpointCount: 1 },
  ],
  'proj_mock_003': [
    { provider: 'OpenAI',   monthlyCost: 58.24, callsPerDay: 1280, endpointCount: 2 },
    { provider: 'Twilio',   monthlyCost: 24.75, callsPerDay:  495, endpointCount: 2 },
    { provider: 'Stripe',   monthlyCost:  0,    callsPerDay: 3650, endpointCount: 6 },
    { provider: 'SendGrid', monthlyCost:  0,    callsPerDay: 1040, endpointCount: 2 },
  ],
};

export const MOCK_COST_BY_PROVIDER = MOCK_COST_BY_PROVIDER_MAP['proj_mock_001'];

// ---------------------------------------------------------------------------
// Cost by file
// ---------------------------------------------------------------------------

export const MOCK_COST_BY_FILE_MAP: Record<string, { file: string; monthlyCost: number; callsPerDay: number; endpointCount: number }[]> = {
  'proj_mock_001': [
    { file: 'src/services/ai.ts',          monthlyCost: 98.50, callsPerDay: 1200, endpointCount: 1 },
    { file: 'src/services/claude.ts',      monthlyCost: 67.20, callsPerDay:  450, endpointCount: 1 },
    { file: 'src/services/search.ts',      monthlyCost: 29.53, callsPerDay:  270, endpointCount: 1 },
    { file: 'src/services/summarise.ts',   monthlyCost: 23.10, callsPerDay:  230, endpointCount: 1 },
    { file: 'src/billing/customers.ts',    monthlyCost:  0,    callsPerDay: 1090, endpointCount: 3 },
    { file: 'src/integrations/github.ts',  monthlyCost:  0,    callsPerDay:  780, endpointCount: 1 },
    { file: 'src/workers/index-worker.ts', monthlyCost: 29.52, callsPerDay:  270, endpointCount: 1 },
    { file: 'src/notifications/email.ts',  monthlyCost:  0,    callsPerDay:  180, endpointCount: 1 },
    { file: 'src/config/providers.ts',     monthlyCost:  0,    callsPerDay:  340, endpointCount: 1 },
  ],
  'proj_mock_002': [
    { file: 'src/pipeline/embed.ts',          monthlyCost: 189.00, callsPerDay: 4200, endpointCount: 2 },
    { file: 'src/labeling/auto-label.ts',     monthlyCost:  74.80, callsPerDay:  820, endpointCount: 1 },
    { file: 'src/training/fine-tune.ts',      monthlyCost:  42.60, callsPerDay:    2, endpointCount: 1 },
    { file: 'src/search/rerank.ts',           monthlyCost:  28.80, callsPerDay:  960, endpointCount: 1 },
    { file: 'src/pipeline/summarise.ts',      monthlyCost:  17.00, callsPerDay:  340, endpointCount: 1 },
    { file: 'src/labeling/classifier.ts',     monthlyCost:  15.60, callsPerDay:  520, endpointCount: 1 },
    { file: 'src/pipeline/batch-embed.ts',    monthlyCost:  21.60, callsPerDay:   12, endpointCount: 1 },
    { file: 'src/vector/store.ts',            monthlyCost:   0,    callsPerDay: 1400, endpointCount: 1 },
    { file: 'src/search/semantic-search.ts',  monthlyCost:   0,    callsPerDay:  680, endpointCount: 1 },
    { file: 'src/storage/s3.ts',              monthlyCost:   0,    callsPerDay: 1800, endpointCount: 1 },
    { file: 'src/workers/queue-consumer.ts',  monthlyCost:   0,    callsPerDay: 2880, endpointCount: 1 },
    { file: 'src/qa/quality-check.ts',        monthlyCost:   0,    callsPerDay:  160, endpointCount: 1 },
  ],
  'proj_mock_003': [
    { file: 'src/support/chat.ts',          monthlyCost: 58.24, callsPerDay: 1280, endpointCount: 3 },
    { file: 'src/notifications/sms.ts',     monthlyCost: 15.50, callsPerDay:  310, endpointCount: 1 },
    { file: 'src/auth/phone-verify.ts',     monthlyCost:  9.25, callsPerDay:  185, endpointCount: 1 },
    { file: 'src/checkout/payment.ts',      monthlyCost:  0,    callsPerDay:  480, endpointCount: 1 },
    { file: 'src/auth/middleware.ts',       monthlyCost:  0,    callsPerDay: 1840, endpointCount: 1 },
    { file: 'src/billing/portal.ts',        monthlyCost:  0,    callsPerDay:  910, endpointCount: 2 },
    { file: 'src/dashboard/overview.ts',    monthlyCost:  0,    callsPerDay:  620, endpointCount: 1 },
    { file: 'src/pages/pricing.ts',         monthlyCost:  0,    callsPerDay:  840, endpointCount: 2 },
    { file: 'src/billing/history.ts',       monthlyCost:  0,    callsPerDay:  290, endpointCount: 1 },
    { file: 'src/notifications/email.ts',   monthlyCost:  0,    callsPerDay: 1040, endpointCount: 2 },
    { file: 'src/auth/welcome.ts',          monthlyCost:  0,    callsPerDay:  520, endpointCount: 1 },
  ],
};

export const MOCK_COST_BY_FILE = MOCK_COST_BY_FILE_MAP['proj_mock_001'];

// ---------------------------------------------------------------------------
// Cost summary
// ---------------------------------------------------------------------------

export const MOCK_COST_SUMMARY_MAP: Record<string, { totalMonthlyCost: number; totalCallsPerDay: number; endpointCount: number }> = {
  'proj_mock_001': { totalMonthlyCost: 247.85, totalCallsPerDay: 4820, endpointCount: 12 },
  'proj_mock_002': { totalMonthlyCost: 389.40, totalCallsPerDay: 8940, endpointCount: 12 },
  'proj_mock_003': { totalMonthlyCost:  83.60, totalCallsPerDay: 3270, endpointCount: 12 },
};

export const MOCK_SCANS_MAP: Record<string, typeof MOCK_SCANS_001> = {
  'proj_mock_001': MOCK_SCANS_001,
  'proj_mock_002': MOCK_SCANS_002,
  'proj_mock_003': MOCK_SCANS_003,
};

// ---------------------------------------------------------------------------
// Parser runs
// ---------------------------------------------------------------------------

const MOCK_PARSER_RESULTS_001 = [
  {
    id: 'res_mock_001a',
    run_id: 'run_mock_001',
    repo: 'acme-corp/backend-api',
    target: null,
    scanned_file_count: 84,
    endpoints: JSON.stringify([
      { endpoint: '/v1/chat/completions', provider: 'OpenAI',    method: 'POST', frequencyClass: 'high',   costModel: 'per-token',  estimatedMonthlyCost: 142.50 },
      { endpoint: '/v1/embeddings',       provider: 'OpenAI',    method: 'POST', frequencyClass: 'medium', costModel: 'per-token',  estimatedMonthlyCost:  38.20 },
      { endpoint: '/v1/messages',         provider: 'Anthropic', method: 'POST', frequencyClass: 'medium', costModel: 'per-token',  estimatedMonthlyCost:  67.80 },
      { endpoint: '/v1/payment_intents',  provider: 'Stripe',    method: 'POST', frequencyClass: 'low',    costModel: 'per-call',   estimatedMonthlyCost:   0    },
      { endpoint: '/v3/mail/send',        provider: 'SendGrid',  method: 'POST', frequencyClass: 'low',    costModel: 'per-call',   estimatedMonthlyCost:   0    },
    ]),
    suggestions: JSON.stringify([
      { title: 'Cache embedding results',          type: 'caching',      estimatedSaving: 22.80 },
      { title: 'Batch chat completions',           type: 'batching',     estimatedSaving: 18.40 },
      { title: 'Switch to claude-haiku for FAQs',  type: 'model-swap',   estimatedSaving: 31.20 },
    ]),
    summary: JSON.stringify({ totalMonthlyCost: 248.50, scannedFileCount: 84, endpointCount: 5, suggestionCount: 3 }),
    collected_at: Date.now() - 1000 * 60 * 14,
  },
];

const MOCK_PARSER_RESULTS_002 = [
  {
    id: 'res_mock_002a',
    run_id: 'run_mock_002',
    repo: 'acme-corp/data-pipeline',
    target: null,
    scanned_file_count: 37,
    endpoints: JSON.stringify([
      { endpoint: '/v1/embeddings',  provider: 'OpenAI',    method: 'POST', frequencyClass: 'high',   costModel: 'per-token', estimatedMonthlyCost: 94.10 },
      { endpoint: '/v1/completions', provider: 'OpenAI',    method: 'POST', frequencyClass: 'medium', costModel: 'per-token', estimatedMonthlyCost: 51.30 },
    ]),
    suggestions: JSON.stringify([
      { title: 'Use text-embedding-3-small instead of ada-002', type: 'model-swap', estimatedSaving: 41.00 },
    ]),
    summary: JSON.stringify({ totalMonthlyCost: 145.40, scannedFileCount: 37, endpointCount: 2, suggestionCount: 1 }),
    collected_at: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'res_mock_002b',
    run_id: 'run_mock_002',
    repo: 'acme-corp/ml-service',
    target: null,
    scanned_file_count: 22,
    endpoints: JSON.stringify([
      { endpoint: '/inference', provider: 'HuggingFace', method: 'POST', frequencyClass: 'medium', costModel: 'per-call', estimatedMonthlyCost: 28.60 },
    ]),
    suggestions: JSON.stringify([]),
    summary: JSON.stringify({ totalMonthlyCost: 28.60, scannedFileCount: 22, endpointCount: 1, suggestionCount: 0 }),
    collected_at: Date.now() - 1000 * 60 * 60 * 3,
  },
];

export const MOCK_PARSER_RUNS = [
  {
    id: 'run_mock_001',
    status: 'done',
    repos: JSON.stringify(['https://github.com/acme-corp/backend-api']),
    results_found: 1,
    duration_ms: 4820,
    triggered_by: 'ui',
    created_at: Date.now() - 1000 * 60 * 14,
  },
  {
    id: 'run_mock_002',
    status: 'done',
    repos: JSON.stringify(['https://github.com/acme-corp/data-pipeline', 'https://github.com/acme-corp/ml-service']),
    results_found: 2,
    duration_ms: 11340,
    triggered_by: 'cron',
    created_at: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'run_mock_003',
    status: 'failed',
    repos: JSON.stringify(['https://github.com/acme-corp/frontend']),
    results_found: 0,
    duration_ms: 2100,
    triggered_by: 'ui',
    created_at: Date.now() - 1000 * 60 * 60 * 27,
  },
  {
    id: 'run_mock_004',
    status: 'queued',
    repos: JSON.stringify(['https://github.com/acme-corp/workers']),
    results_found: 0,
    duration_ms: null,
    triggered_by: 'ui',
    created_at: Date.now() - 1000 * 30,
  },
];

export const MOCK_PARSER_RESULTS_MAP: Record<string, typeof MOCK_PARSER_RESULTS_001> = {
  'run_mock_001': MOCK_PARSER_RESULTS_001,
  'run_mock_002': MOCK_PARSER_RESULTS_002 as typeof MOCK_PARSER_RESULTS_001,
  'run_mock_003': [],
  'run_mock_004': [],
};
