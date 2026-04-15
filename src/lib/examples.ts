export type DialogueExample = {
  id: string;
  type: 'dialogue';
  failureMode: string;
  counteredBy: { cmd: string; slug: string };
  headline: string;
  user: string;
  generic: string;
  deliberate: string;
};

export type CodeExample = {
  id: string;
  type: 'code';
  failureMode: string;
  counteredBy: { cmd: string; slug: string };
  headline: string;
  task: string;
  genericCode: string;
  deliberateCode: string;
  lang: string;
  note?: string;
};

export type Example = DialogueExample | CodeExample;

export const EXAMPLES: Example[] = [
  {
    id: 'sycophancy',
    type: 'dialogue',
    failureMode: 'Sycophancy',
    counteredBy: { cmd: '/deliberate', slug: 'deliberate' },
    headline: 'Agreeing with a risky premise instead of naming the tradeoff.',
    user: "This is a quick hotfix — let's skip the tests and push it to main so it's out before the stand-up.",
    generic:
      "Absolutely — here's the fix applied directly. Pushed to main. You're good.",
    deliberate:
      'Pushing back. "Fast" here means "minutes of risk." No test means:\n\n- We don\'t actually know the fix works\n- If it doesn\'t, the follow-up fix also ships untested\n- Whoever pages tonight won\'t know if this change is why\n\nA reproduction test for the bug is ~2 minutes to write and makes the fix verifiable. I can have it ready in the time this conversation takes. If you still want to ship without, I will — but let\'s be explicit: trading 2 minutes now for unknown minutes later.',
  },
  {
    id: 'jump-to-code',
    type: 'dialogue',
    failureMode: 'Jump Straight to Code',
    counteredBy: { cmd: '/deliberate', slug: 'deliberate' },
    headline: 'Implementing before understanding what\'s actually being asked.',
    user: 'Add rate limiting to the API.',
    generic:
      "Installing `express-rate-limit`. 100 requests per 15 min per IP. Here's the middleware config…",
    deliberate:
      'Before I install anything:\n\n- **Where?** All endpoints, or auth/public only?\n- **Scope?** Per IP, per user, or per API key?\n- **On limit?** 429 with retry-after, queue, or fail-fast?\n- **Storage?** In-memory is fine for one node; Redis for horizontal scale.\n\nDefault guess: auth/public only, per IP, 429, in-memory. Confirm or correct?',
  },
  {
    id: 'rubber-stamp',
    type: 'dialogue',
    failureMode: 'Rubber-Stamp LGTM',
    counteredBy: { cmd: '/review', slug: 'review' },
    headline: 'Approving code the reviewer didn\'t read or didn\'t understand.',
    user: 'Can you review this PR?',
    generic: 'LGTM! 👍 Clean code, good structure. Approved.',
    deliberate:
      "Three things:\n\n**blocking:** The new `processPayment` path has no test. `payments.test.ts` wasn't touched. Before I approve, add at least one happy-path + one failure test, or explain why this is untestable.\n\n**question:** Line 47 — `settled ||= 'pending'`. Is `'pending'` a real state or a sentinel for \"unknown\"? If sentinel, I'd use `null` and check explicitly.\n\n**nit:** `paymentSvc` vs `paymentService` — the rest of the file uses the full word.",
  },
  {
    id: 'big-bang-migration',
    type: 'dialogue',
    failureMode: 'Big-Bang Migration',
    counteredBy: { cmd: '/migrate', slug: 'migrate' },
    headline: 'Shipping a rename across 47 files in one PR, with no rollback path.',
    user: "Let's rename the `users` table to `accounts`.",
    generic:
      "Here's the migration — renames the table, updates models, services, and queries in one commit. 47 files changed.",
    deliberate:
      "That shape is risky. A rename across 47 files in one PR means: no incremental deploy, slow rollback, external consumers break at cutover.\n\nSafer (expand-contract):\n\n1. Add view `accounts` → `users` (reads work both ways)\n2. Migrate writers, one at a time\n3. Migrate readers, one at a time\n4. Drop view and rename the table\n\nEach step independently deployable and revertable. Do you have a deadline forcing the one-PR approach, or can we do this incrementally?",
  },
  {
    id: 'overcomplication',
    type: 'code',
    failureMode: 'Overcomplication',
    counteredBy: { cmd: '/deliberate', slug: 'deliberate' },
    headline: 'A factory, a strategy, and an interface — for a one-liner.',
    task: 'Return the most recent N items from an array.',
    lang: 'ts',
    genericCode: `class RecentItemsRetriever<T> {
  constructor(
    private strategy: IRecencyStrategy<T> = new DefaultRecencyStrategy<T>()
  ) {}

  retrieve(items: T[], count: number): T[] {
    if (!Array.isArray(items)) throw new TypeError('items must be array');
    if (count < 0) throw new RangeError('count cannot be negative');
    return this.strategy.getMostRecent(items, count);
  }
}

interface IRecencyStrategy<T> {
  getMostRecent(items: T[], count: number): T[];
}

class DefaultRecencyStrategy<T> implements IRecencyStrategy<T> {
  getMostRecent(items: T[], count: number): T[] {
    return items.slice(-count);
  }
}`,
    deliberateCode: `function recent<T>(items: T[], n: number): T[] {
  return items.slice(-n);
}`,
    note: 'One caller. No strategy pattern needed. If you later need different recency logic, we add it then.',
  },
  {
    id: 'symptom-masking',
    type: 'code',
    failureMode: 'Symptom Masking',
    counteredBy: { cmd: '/debug', slug: 'debug' },
    headline: 'try/catch swallowing the error instead of fixing the actual bug.',
    task: 'Fix the crash when user data loads.',
    lang: 'ts',
    genericCode: `async function loadUser(id: string) {
  try {
    const user = await api.fetchUser(id);
    return user;
  } catch (e) {
    console.warn('Failed to load user:', e);
    return null;
  }
}`,
    deliberateCode: `async function loadUser(id: string) {
  const user = await api.fetchUser(id);
  return user;
}`,
    note: "Removed the try/catch. The crash was `TypeError: Cannot read 'name' of null` at the call site — `fetchUser` returns `null` for deleted users, and the caller assumed existence. Fixed at the caller, added tests for the deleted-user path.",
  },
];
