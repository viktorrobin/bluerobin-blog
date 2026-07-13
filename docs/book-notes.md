# Book Notes — Personal Feedback

Raw reading notes used as source material to generate or update full reviews
in `src/content/library/`. Each entry captures: personal verdict, what's worth
keeping, what to skip, pairing suggestions.

---

## Software Architecture

### Designing Data-Intensive Applications — Martin Kleppmann
- **Verdict:** Absolute must-have
- **Recommendation:** essential
- **Notes:** Focus on design principles and key concepts makes it still relevant despite the field moving fast. One of those rare books that ages well because it teaches fundamentals rather than tools.

### Domain-Driven Design — Eric Evans
- **Verdict:** The bible
- **Recommendation:** essential
- **Notes:** Quite dry to read but very important. Every serious backend engineer needs to go through it. Pair with "Implementing Domain-Driven Design" by Vaughn Vernon — the two books complement each other: Evans gives you the concepts, Vernon gives you the implementation.

### Learning Domain-Driven Design — Vlad Khononov
- **Verdict:** OK
- **Recommendation:** good
- **Notes:** Too many simplifications, which makes you lose sight of the real value of DDD. Fine as an entry point, but risks giving readers a watered-down understanding. Go to Evans directly if you can stomach the prose.

### Building Microservices — Sam Newman
- **Verdict:** Amazing
- **Recommendation:** essential
- **Notes:** One of those books you read and then reread a year later and get even more out of it. Covers the space thoroughly without being academic. Every new edition keeps it fresh.

### Clean Architecture — Robert C. Martin
- **Verdict:** Another bible
- **Recommendation:** essential
- **Notes:** Uncle Bob at his best when writing about principles. Core dependency-rule insight is worth the price of the book. Some readers find the padding around the core ideas frustrating — skip those parts.

### Designing Distributed Systems — Brendan Burns
- **Verdict:** OK
- **Recommendation:** optional
- **Notes:** One of those books where the first quarter is genuinely useful and then it just repeats the same patterns over and over. Read the first few chapters, skim or skip the rest.

### Building Event-Driven Microservices — Adam Bellemare
- **Verdict:** OK
- **Recommendation:** optional
- **Notes:** Same pattern as Designing Distributed Systems — the first quarter is solid, then it runs out of steam and starts repeating itself. Good enough to read once for the vocabulary.

---

## Data & Cloud

### Delta Lake: Up and Running — Denny Lee, Tristen Wentlandt
- **Verdict:** Not amazing but useful
- **Recommendation:** good
- **Notes:** Not a great book per se, but a decent literature review on the different generations of data platforms and warehouses — lambda, kappa, lakehouse. Worth a read if you want a structured overview of that evolution rather than hunting through blog posts.

### Cloud Computing — Thomas Erl
- **Verdict:** Dated
- **Recommendation:** skip
- **Notes:** Not aging very well. The concepts were useful when written but the field has moved too far. Skip in 2026.

### Cloud Computing Design Patterns — Thomas Erl
- **Verdict:** Dated
- **Recommendation:** skip
- **Notes:** Same as the Erl cloud computing book — not aging well. The patterns it describes are either absorbed into platform services or superseded by better frameworks.

---

## Engineering Craft

### The Pragmatic Programmer — David Thomas, Andrew Hunt
- **Verdict:** Bible, absolute must-have
- **Recommendation:** essential
- **Notes:** Every engineer should read this. Timeless principles. The newer edition keeps it relevant. No excuses not to.

### Effective Python — Brett Slatkin
- **Verdict:** Was relevant, less so now
- **Recommendation:** good
- **Notes:** Was genuinely useful at the time. Probably less impactful in 2026 — Python itself and its ecosystem have matured to the point where a lot of the advice is absorbed into tooling defaults. Still solid if you're new to idiomatic Python.

### The Go Programming Language — Alan A.A. Donovan, Brian W. Kernighan
- **Verdict:** Good
- **Recommendation:** recommended
- **Notes:** A good book to get the key concepts of Go. Clear, concise, well-structured — reflects the language design philosophy. Not a comprehensive reference but the right starting point.

### Refactoring — Martin Fowler
- **Verdict:** Great
- **Recommendation:** essential
- **Notes:** Great book with concrete code examples. Technical and requires focus — not an airport read, needs a proper desk session. The catalogue of refactorings is the core value; return to it when you're in the middle of a messy codebase.

### Test-Driven Development by Example — Kent Beck
- **Verdict:** 5 stars, key one to read and reread
- **Recommendation:** essential
- **Notes:** One of the most important books in software engineering. Read it once to get the fundamentals, then reread it after 1-2 years of practice and you'll get a completely different layer of insight. Beck's writing is unusually clear.

### Clean Code — Robert C. Martin
- **Verdict:** Classic
- **Recommendation:** essential
- **Notes:** A classic to read because it focuses on core design principles of software engineering rather than language specifics. Some of the Java examples feel dated but the principles hold.

### The Clean Coder — Robert C. Martin
- **Verdict:** Classic
- **Recommendation:** essential
- **Notes:** Companion to Clean Code but focused on professionalism, practices, and the craft mindset rather than code mechanics. Worth reading as a set with Clean Code.

### Extreme Programming Explained — Kent Beck
- **Verdict:** OK
- **Recommendation:** good
- **Notes:** Not as transformative as the TDD book. The ideas are important historically and XP concepts underpin a lot of modern agile practice, but the direct impact of reading this vs. TDD by Example is lower. Read if you want the full Beck canon.

---

## How to use this file

When generating or updating a library MDX entry:
1. Cross-reference the notes above for the personal verdict and angle
2. Map verdict → `recommendation`: `essential` / `recommended` / `good` / `optional` / `skip`
3. The "Notes" field should inform the one-paragraph verdict and key callouts in the MDX
4. Preserve any pairing suggestions as `relatedBooks` or inline callouts
