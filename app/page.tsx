"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Leaf,
  LoaderCircle,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";

type RecipeStep = {
  number: number;
  title: string;
  instruction: string;
  minutes: number;
  tip: string;
};

type Recipe = {
  title: string;
  tagline: string;
  timeMinutes: number;
  difficulty: "Easy" | "Medium";
  servings: number;
  uses: string[];
  mayNeed: string[];
  steps: RecipeStep[];
  chefNote: string;
  wasteSaved: string;
  safetyNote: string;
};

type ApiResponse = {
  recipe: Recipe;
  mode: "ai" | "demo";
  model?: string;
};

const examples = [
  "chickpeas, rice, spinach, tomatoes",
  "eggs, tortillas, black beans, cheese",
  "pasta, frozen peas, lemon, parmesan",
];

const dietaryRestrictionOptions = ["Vegetarian", "Vegan", "Gluten-free", "Dairy-free"];
const refinements = [
  { label: "Make it faster", value: "Reduce the total time and simplify the steps." },
  { label: "Fewer extras", value: "Use fewer additional pantry staples." },
  { label: "More protein", value: "Increase the protein using only compatible ingredients." },
];

export default function Home() {
  const [ingredients, setIngredients] = useState("chickpeas, rice, spinach, tomatoes");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [minutes, setMinutes] = useState(30);
  const [servings, setServings] = useState(2);
  const [skill, setSkill] = useState("Beginner");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [mode, setMode] = useState<"ai" | "demo" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cookStep, setCookStep] = useState<number | null>(null);

  const ingredientCount = useMemo(
    () => ingredients.split(/[,\n]/).map((item) => item.trim()).filter(Boolean).length,
    [ingredients],
  );

  async function generateRecipe(refinement?: string) {
    if (ingredientCount < 2) {
      setError("Add at least two ingredients so the chef has something to work with.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          dietaryRestrictions,
          minutes,
          servings,
          skill,
          refinement,
          previousRecipe: refinement ? recipe : undefined,
        }),
      });
      const payload = (await response.json()) as ApiResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || "The recipe could not be generated.");
      setRecipe(payload.recipe);
      setMode(payload.mode);
      requestAnimationFrame(() => document.querySelector("#recipe")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void generateRecipe();
  }

  function toggleDietaryRestriction(option: string) {
    setDietaryRestrictions((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f0e7] text-[#1f2a20]">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3" aria-label="Pantry Remix home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#173f2b] text-[#f8f2df] shadow-[0_8px_20px_rgba(23,63,43,.18)]">
            <ChefHat size={21} strokeWidth={1.8} />
          </span>
          <span className="font-display text-[1.35rem] font-semibold tracking-[-.03em]">Pantry Remix</span>
        </a>
        <div className="flex items-center gap-2 rounded-full border border-[#1f2a20]/10 bg-white/60 px-3 py-2 text-xs font-semibold text-[#435247] backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#e9753d]" />
          AI kitchen assistant
        </div>
      </nav>

      <section id="top" className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:pb-20 lg:pt-16">
        <div className="flex flex-col justify-center lg:pr-10">
          <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-[#c65b2d]">
            <span className="h-px w-10 bg-[#c65b2d]" /> Cook what you have
          </div>
          <h1 className="font-display max-w-3xl text-[clamp(3.25rem,7vw,7rem)] font-medium leading-[.88] tracking-[-.065em] text-[#173f2b]">
            Your pantry has a plan.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5a635a] sm:text-xl">
            Turn the odds and ends already in your kitchen into one doable dinner—with clear steps and zero recipe-page clutter.
          </p>
          <div className="mt-9 flex flex-wrap gap-6 text-sm font-medium text-[#435247]">
            <span className="flex items-center gap-2"><Check size={17} className="text-[#c65b2d]" /> Uses your ingredients first</span>
            <span className="flex items-center gap-2"><Check size={17} className="text-[#c65b2d]" /> Beginner-friendly steps</span>
          </div>
        </div>

        <form onSubmit={submit} className="relative overflow-hidden rounded-[2rem] border border-[#173f2b]/10 bg-[#fffdf8] p-5 shadow-[0_30px_80px_rgba(31,42,32,.12)] sm:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#edb662]/25 blur-3xl" />
          <div className="relative">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-[#c65b2d]">Step 01</p>
                <h2 className="font-display text-3xl font-semibold tracking-[-.04em]">What’s in the kitchen?</h2>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef0df] text-[#173f2b]"><Leaf size={22} /></span>
            </div>

            <label className="field-label" htmlFor="ingredients">Pantry ingredients</label>
            <div className="relative">
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(event) => setIngredients(event.target.value)}
                placeholder="e.g. rice, eggs, spinach, canned tomatoes"
                className="min-h-32 w-full resize-none rounded-2xl border border-[#173f2b]/15 bg-white px-4 py-4 pr-16 text-base leading-7 outline-none transition focus:border-[#c65b2d] focus:ring-4 focus:ring-[#c65b2d]/10"
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-[#f5f0e7] px-2.5 py-1 text-[11px] font-bold text-[#657068]">{ingredientCount} items</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="py-1 text-xs text-[#7b827b]">Try:</span>
              {examples.map((example, index) => (
                <button key={example} type="button" onClick={() => setIngredients(example)} className="rounded-full border border-[#173f2b]/10 bg-[#f7f3eb] px-3 py-1 text-xs font-medium transition hover:border-[#c65b2d]/40 hover:bg-[#fff7e8]">
                  Pantry #{index + 1}
                </button>
              ))}
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <span className="field-label">Dietary restrictions <span className="normal-case tracking-normal text-[#8a918a]">(optional)</span></span>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryRestrictionOptions.map((option) => (
                    <label key={option} className={`choice cursor-pointer ${dietaryRestrictions.includes(option) ? "choice-active" : ""}`}>
                      <input
                        type="checkbox"
                        name="dietaryRestrictions"
                        value={option}
                        checked={dietaryRestrictions.includes(option)}
                        onChange={() => toggleDietaryRestriction(option)}
                        className="diet-checkbox"
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-5 text-[#7b827b]">Leave all unchecked for no dietary restriction.</p>
              </div>
              <div>
                <span className="field-label">Cooking time</span>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 45].map((option) => (
                    <button key={option} type="button" onClick={() => setMinutes(option)} className={`choice justify-center ${minutes === option ? "choice-active" : ""}`}>
                      {option}m
                    </button>
                  ))}
                </div>
                <span className="field-label mt-5">Skill level</span>
                <div className="grid grid-cols-2 gap-2">
                  {["Beginner", "Confident"].map((option) => (
                    <button key={option} type="button" onClick={() => setSkill(option)} className={`choice justify-center ${skill === option ? "choice-active" : ""}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between rounded-2xl bg-[#f2efe7] p-3.5">
              <span className="text-sm font-semibold">Servings</span>
              <div className="flex items-center gap-4">
                <button type="button" aria-label="Decrease servings" onClick={() => setServings(Math.max(1, servings - 1))} className="counter"><Minus size={15} /></button>
                <span className="w-4 text-center font-bold">{servings}</span>
                <button type="button" aria-label="Increase servings" onClick={() => setServings(Math.min(8, servings + 1))} className="counter"><Plus size={15} /></button>
              </div>
            </div>

            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="group mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#173f2b] px-5 py-4 font-bold text-white shadow-[0_12px_30px_rgba(23,63,43,.22)] transition hover:-translate-y-0.5 hover:bg-[#0e3220] disabled:cursor-wait disabled:opacity-70">
              {loading ? <><LoaderCircle size={19} className="animate-spin" /> Remixing your pantry…</> : <><Sparkles size={18} /> Make my recipe <ArrowRight size={18} className="transition group-hover:translate-x-1" /></>}
            </button>
          </div>
        </form>
      </section>

      <section id="recipe" className="scroll-mt-5 bg-[#173f2b] px-5 py-16 text-[#f8f2df] sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1344px]">
          {!recipe ? (
            <div className="grid min-h-[430px] place-items-center rounded-[2rem] border border-dashed border-white/20 bg-white/[.035] p-8 text-center">
              <div className="max-w-md">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f8f2df]/10"><UtensilsCrossed size={27} strokeWidth={1.6} /></span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-[#edb662]">Step 02</p>
                <h2 className="font-display mt-2 text-4xl tracking-[-.04em]">Your recipe lands here.</h2>
                <p className="mt-3 leading-7 text-[#c5cec6]">Add what you have above. Pantry Remix will organize it into one practical dinner and a calm, step-by-step cooking flow.</p>
              </div>
            </div>
          ) : (
            <div className="animate-reveal">
              <div className="grid items-end gap-8 border-b border-white/15 pb-10 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#edb662] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#173f2b]">{mode === "ai" ? "AI generated" : "Demo mode"}</span>
                    <span className="text-xs uppercase tracking-[.16em] text-[#acb9ad]">Built from your pantry</span>
                  </div>
                  <h2 className="font-display max-w-4xl text-5xl font-medium leading-none tracking-[-.05em] sm:text-6xl lg:text-7xl">{recipe.title}</h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-[#cbd3cb]">{recipe.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Stat icon={<Clock3 size={17} />} label={`${recipe.timeMinutes} min`} />
                  <Stat icon={<Flame size={17} />} label={recipe.difficulty} />
                  <Stat icon={<UtensilsCrossed size={17} />} label={`${recipe.servings} servings`} />
                </div>
              </div>

              <div className="grid gap-12 py-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
                <aside>
                  <p className="eyebrow">Ingredient check</p>
                  <h3 className="font-display mt-2 text-3xl tracking-[-.035em]">You’ve already got the good stuff.</h3>
                  <div className="mt-7 space-y-3">
                    {recipe.uses.map((item) => <Ingredient key={item} text={item} included />)}
                  </div>
                  {recipe.mayNeed.length > 0 && (
                    <>
                      <p className="eyebrow mt-9">Pantry basics</p>
                      <div className="mt-4 space-y-3">
                        {recipe.mayNeed.map((item) => <Ingredient key={item} text={item} />)}
                      </div>
                    </>
                  )}
                  <div className="mt-9 rounded-2xl bg-[#214e38] p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#edb662]"><Leaf size={17} /> Waste-less win</div>
                    <p className="mt-2 text-sm leading-6 text-[#d7dfd6]">{recipe.wasteSaved}</p>
                  </div>
                </aside>

                <article>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow">The game plan</p>
                      <h3 className="font-display mt-2 text-3xl tracking-[-.035em]">From counter to table.</h3>
                    </div>
                    <button onClick={() => setCookStep(0)} className="hidden rounded-full bg-[#f8f2df] px-5 py-3 text-sm font-bold text-[#173f2b] transition hover:bg-white sm:block">Start cook mode</button>
                  </div>
                  <ol className="mt-8 space-y-4">
                    {recipe.steps.map((step) => (
                      <li key={step.number} className="group grid grid-cols-[44px_1fr_auto] gap-4 rounded-2xl border border-white/10 bg-white/[.045] p-4 transition hover:border-[#edb662]/35 hover:bg-white/[.07] sm:p-5">
                        <span className="grid h-11 w-11 place-items-center rounded-full border border-[#edb662]/40 font-display text-lg text-[#edb662]">{String(step.number).padStart(2, "0")}</span>
                        <div>
                          <h4 className="font-bold text-white">{step.title}</h4>
                          <p className="mt-1.5 leading-7 text-[#cbd3cb]">{step.instruction}</p>
                          {step.tip && <p className="mt-2 text-sm italic text-[#edb662]">Chef tip: {step.tip}</p>}
                        </div>
                        <span className="pt-1 text-xs font-bold text-[#9daca0]">{step.minutes}m</span>
                      </li>
                    ))}
                  </ol>
                  <button onClick={() => setCookStep(0)} className="mt-5 w-full rounded-2xl bg-[#f8f2df] px-5 py-4 font-bold text-[#173f2b] sm:hidden">Start cook mode</button>
                </article>
              </div>

              <div className="grid gap-6 border-t border-white/15 pt-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-bold text-[#edb662]">Chef’s note</p>
                  <p className="mt-2 max-w-3xl leading-7 text-[#d4dcd4]">{recipe.chefNote}</p>
                  <p className="mt-2 text-xs text-[#90a092]">{recipe.safetyNote}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {refinements.map((item) => (
                    <button key={item.label} disabled={loading} onClick={() => void generateRecipe(item.value)} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:border-[#edb662]/50 hover:bg-white/[.06] disabled:opacity-50">
                      <RefreshCw size={14} /> {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-[#102d20] px-5 py-8 text-center text-sm text-[#aebbb0]">
        <p><span className="font-display text-[#f8f2df]">Pantry Remix</span> · A prompt-engineered AI recipe MVP</p>
      </footer>

      {recipe && cookStep !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0b2117]/95 p-4 text-[#f8f2df] backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Cook mode">
          <button onClick={() => setCookStep(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:bg-white/10" aria-label="Close cook mode"><X /></button>
          <div className="w-full max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#edb662]">Step {cookStep + 1} of {recipe.steps.length}</p>
            <div className="mx-auto mt-6 grid h-20 w-20 place-items-center rounded-full border border-[#edb662]/40 font-display text-3xl text-[#edb662]">{recipe.steps[cookStep].minutes}m</div>
            <h2 className="font-display mt-8 text-5xl tracking-[-.05em] sm:text-7xl">{recipe.steps[cookStep].title}</h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-[#d1d9d1]">{recipe.steps[cookStep].instruction}</p>
            {recipe.steps[cookStep].tip && <p className="mt-5 text-[#edb662]">Chef tip: {recipe.steps[cookStep].tip}</p>}
            <div className="mt-12 flex items-center justify-center gap-3">
              <button disabled={cookStep === 0} onClick={() => setCookStep(Math.max(0, cookStep - 1))} className="cook-nav"><ChevronLeft /> Back</button>
              {cookStep < recipe.steps.length - 1 ? (
                <button onClick={() => setCookStep(cookStep + 1)} className="cook-nav cook-nav-primary">Next step <ChevronRight /></button>
              ) : (
                <button onClick={() => setCookStep(null)} className="cook-nav cook-nav-primary"><Check /> Plate it!</button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[.05] px-4 py-2.5 text-sm font-semibold">{icon}{label}</span>;
}

function Ingredient({ text, included = false }: { text: string; included?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#e3e8e3]">
      <span className={`grid h-6 w-6 place-items-center rounded-full ${included ? "bg-[#edb662] text-[#173f2b]" : "border border-white/20 text-[#a5b2a7]"}`}>
        {included ? <Check size={14} strokeWidth={3} /> : <Plus size={13} />}
      </span>
      <span className="capitalize">{text}</span>
    </div>
  );
}
