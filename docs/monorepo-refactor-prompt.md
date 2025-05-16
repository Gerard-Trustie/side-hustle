---

Here’s a prompt you can use to instruct an LLM to follow your monorepo refactor plan step by step, testing and committing to GitHub after each step. This prompt is designed to ensure careful, incremental progress with version control best practices.

---

**Prompt for LLM: Monorepo Refactor Plan Execution**

You are to follow the implementation plan in `docs/monorepo-refactor-plan.md` to refactor this Next.js project into a monorepo with two apps (admin and public-facing).  
**Your instructions:**

1. **Work through the plan one step at a time.**
   - Start with the first item in the migration checklist.
   - For each step, read the relevant section of the plan for details and appendix notes.

2. **After each step:**
   - Test the project to ensure it still works (e.g., run `npm run dev` or the appropriate command for each app).
   - If the step involves moving or refactoring code, ensure there are no build or type errors.
   - If the step involves configuration, verify the configuration is correct and the app(s) still run.

3. **Commit your changes to GitHub after each step.**
   - Use a clear, conventional commit message describing the step (e.g., `chore(monorepo): create apps and packages directories`).
   - Push your changes to the repository.

4. **If you encounter errors or issues:**
   - Stop and document the problem.
   - Attempt to resolve it before proceeding to the next step.
   - Only continue when the project is working and tests (if any) pass.

5. **Repeat for each step in the checklist until the migration is complete.**

6. **Do not skip steps or batch multiple steps into a single commit. Each step should be atomic and reversible.**

7. **Update documentation in `/docs` as needed if you make any adjustments or clarifications.**

**Summary:**  
Follow the plan in `docs/monorepo-refactor-plan.md` step by step. After each step, test, then commit and push to GitHub with a clear message. Do not proceed to the next step until the current one is complete and working.

---

You can copy and paste this prompt into your LLM or coding assistant to guide the refactor process safely and incrementally!


