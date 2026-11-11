/* Source of truth for the chatbot: Nitish Kumar's resume + portfolio content. */
window.CHATBOT_KNOWLEDGE = `
NAME: Nitish Kumar
LOCATION: New Delhi, India
STATUS: Open to full-time roles in Software Engineering (SWE), Backend Systems, Distributed Architecture, and Core Infrastructure.

CONTACT
- Email: nk17.nitish1@gmail.com
- Phone: +91 82278 35726
- GitHub: github.com/nitishnk17
- LinkedIn: linkedin.com/in/nitish-kumar-76272b1b6

SUMMARY
M.Tech student in Computer Science at IIT Delhi (2025-2027) with strong foundations in algorithms, computer networks, and systems engineering. Builds distributed symbolic execution engines, lock-free work-stealing runtimes, and memory-constrained query engines. Learns fast, adapts quickly to new technologies and codebases, and is ready to contribute across diverse software engineering roles. Enjoys cricket and badminton outside work.

EDUCATION
- M.Tech in Computer Science & Engineering, Indian Institute of Technology Delhi, 2025-2027 (ongoing), CGPA 7.41
- B.Tech in Computer Science & Engineering, Tezpur University, 2019-2023, CGPA 7.29
- Bihar School Examination Board (Class 12), PCP Inter College, 2018, 61%
- CBSE (Class 10), DAV Public School, 2016, CGPA 8.6
- IIT Delhi courses done: Cornerstone Project, Mobile Security, Introduction to Data Management, Introduction to Parallel and Distributed Computing, Information Visualization, Systems Concepts, Mathematical Foundations of Computing, Advanced Networks

INTERNSHIP
Cerify - Parallel Systems Software Engineer Intern (May 2026 - July 2026), project: Parallelizing the SKLEE smart-contract analysis runner
- Parallelized a sequential KLEE-based smart-contract analyzer into a two-phase runner with semaphore-gated concurrency, enabling controlled parallel symbolic execution and achieving ~2.47x speedup with identical results.
- Fixed two concurrency bugs that surfaced only under parallel execution (a compiler-state race and colliding output paths).
- Validated exact equivalence with sequential output across the full regression suite (1,000+ smart contracts).
- Tech: C++, KLEE, semaphores, multithreading, race detection.

M.TECH THESIS (IIT Delhi, 2025-2027, ongoing)
Title: TDP-Based Distributed Symbolic Execution Engine with Global Constraint Cache on KLEE 3.2
Supervisor: Prof. Subodh Vishnu Sharma
- Designing a distributed symbolic execution engine on KLEE 3.2 using test-depth partitioning (TDP).
- Peer-to-peer Chase-Lev work-stealing deques for decentralized task distribution, dynamic load balancing, and reduced coordination overhead.
- Shared GreenTrie constraint cache reduces the dominant SMT solver cost (~90% of runtime) by exploiting overlapping queries across adjacent path regions; cache hit rate rises with worker count.
- Achieved 5.43x speedup with 4 workers.
- Tech: C++, KLEE 3.2, Z3 SMT solver, Chase-Lev deques, GreenTrie cache, distributed systems, lock-free.

PROJECTS
1. Work-Stealing Parallel Runtime System
   Task-parallel runtime built from scratch in C++: custom user-level cooperative threading, lock-free Chase-Lev deque, futex-based synchronization, fork-join API (spawn/sync, parallel_for, parallel_reduce). Verified with deterministic invariant checks and ThreadSanitizer (0 data races); benchmarked against OpenMP with competitive scaling and ~95% load balance under adversarial task-cost skew.
2. DB55 Memory-Constrained TPC-H Query Engine (Prof. Kaustubh Beedkar)
   Out-of-core TPC-H query engine under a 64MB virtual memory limit and 10GB scratch-disk budget, using a pipe-based disk simulator. Adaptive memory partitioning, buffer pool with O(1) LRU eviction, sequential-scan bypass, temporary-block recycling, dynamic filtering, projection pushdown, hybrid hash/sort-merge joins, external k-way sorting. Ranked top 5 in the class on the I/O + CPU time leaderboard.
3. Integrated Language Toolchain - Shell, Compiler, VM, Debugger & GC (Prof. Kolin Paul)
   End-to-end C++ toolchain: Flex/Bison frontend, AST construction, bytecode compiler, stack-based VM, process-manager shell, interactive debugger (breakpoints, single-step, variable inspection, per-program memory tracking) and a mark-and-sweep garbage collector.
4. Low-Latency TCP Server & Load Balancer (Prof. Huzur Saran)
   POSIX multi-threaded TCP server with SJF and Round-Robin scheduler queues; external load balancer with connection pooling and a 4-way sharded scheduler queue to remove lock contention; dynamic Least-Response-Time routing that fixed a traffic collapse bug caused by polling delay.
5. RISC-V Hardware Accelerator Design (Prof. Kolin Paul)
   Matrix-multiplication accelerator synthesized with Vivado HLS (C++ kernels to Verilog HDL); analyzed RISC-V assembly for AI inference kernels (register allocation, pipelining, memory access locality).
6. Parallel Distributed Graph Analysis (Prof. Subodh Vishnu Sharma)
   MPI-parallelized BFS, PageRank, and maximal clique detection on Stanford SNAP graphs; distributed Bron-Kerbosch clique finder using MPI point-to-point and collective communication, 5.57x speedup on 16 MPI processes.

HIGHLIGHT METRICS
2.47x runtime speedup at Cerify (KLEE); 64 MB RAM limit TPC-H engine (Top 5); 5.43x speedup with 4 workers on KLEE 3.2 thesis; 5.57x MPI speedup with 16 processes.

TECHNICAL SKILLS
- Languages: C, C++, Python, SQL
- Core CS: Data Structures & Algorithms, Operating Systems, Computer Networks, Database Internals, Multithreading
- Parallel & systems: Distributed Systems, OpenMP, MPI, CUDA, ARM NEON SIMD, lock-free deques, KLEE 3.2, Z3 SMT solver, Flex & Bison, bytecode VMs, RISC-V ISA, Vivado HLS
- Tools: Docker, Git & GitHub, GDB, ThreadSanitizer (TSan), Jadx, LLM-assisted development, prompt engineering

TEACHING ASSISTANTSHIP (IIT Delhi)
- COL106 Data Structures and Algorithms (Jul 2025 - Dec 2025): led weekly labs, graded and mentored a cohort of 100+ undergraduates; evaluated projects on pointer-heavy structures, balanced trees, graph algorithms.
- COL1000 Introduction to Programming (Jan 2026 - Jun 2026): mentored students in labs on debugging, pointers, memory layout, and C++ logic dry-running; helped design diagnostic evaluations and optimize grading pipelines.

POSITIONS OF RESPONSIBILITY (Tezpur University)
- Student Coordinator, National Service Scheme (NSS), 2020-2022: community welfare campaigns, blood donation camps, social awareness drives.
- Student Coordinator, Unnat Bharat Abhiyan (UBA), 2021-2022: rural development outreach, digital literacy workshops, school mentoring in adopted villages.

STRENGTHS (as described on the portfolio)
Strong CS fundamentals and algorithms; backend and distributed systems; fast learner and adaptable; collaborative leadership and mentorship.
`;
