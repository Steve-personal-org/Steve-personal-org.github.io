"use client";

import { useEffect, useState } from "react";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

type Choice = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  badge?: string;
};

type DateChoice = {
  value: string;
  weekday: string;
  date: string;
  note: string;
};

type MovieChoice = {
  id: string;
  englishTitle: string;
  emoji: string;
  release: string;
  status: string;
  genre: string;
  description: string;
  tone: string;
};

type Plan = {
  activity: string;
  movie: string;
  food: string;
  date: string;
  time: string;
  extras: string[];
  note: string;
};

const activities: Choice[] = [
  {
    id: "新片首映夜",
    emoji: "🎬",
    title: "新片首映夜",
    description: "最近有新电影上映，爆米花和你的手我都想牵。",
    badge: "近期新片",
  },
  {
    id: "世界杯决赛",
    emoji: "⚽",
    title: "世界杯决赛",
    description: "周末去有大屏的体育酒吧，一起为喜欢的球队欢呼。",
    badge: "周末限定",
  },
  {
    id: "落日晚餐",
    emoji: "🌇",
    title: "落日晚餐",
    description: "找一家氛围很好的餐厅，慢慢吃，慢慢聊。",
  },
  {
    id: "城市散步",
    emoji: "🌷",
    title: "城市散步",
    description: "逛小店、喝咖啡，走累了就靠在我身上。",
  },
  {
    id: "宅家抱抱",
    emoji: "🧸",
    title: "宅家抱抱",
    description: "点喜欢的外卖，窝在沙发里看一部老电影。",
  },
  {
    id: "神秘惊喜",
    emoji: "🎀",
    title: "神秘惊喜",
    description: "你只负责变漂亮，剩下的全部交给我。",
  },
];

const foods: Choice[] = [
  {
    id: "热辣火锅",
    emoji: "🍲",
    title: "热辣火锅",
    description: "咕嘟咕嘟的快乐，想吃什么都涮进去。",
  },
  {
    id: "日料寿司",
    emoji: "🍣",
    title: "日料寿司",
    description: "清清爽爽，适合认真约会的一餐。",
  },
  {
    id: "滋滋烤肉",
    emoji: "🥩",
    title: "滋滋烤肉",
    description: "我负责烤，你负责吃第一口。",
  },
  {
    id: "意面披萨",
    emoji: "🍝",
    title: "意面披萨",
    description: "奶油、芝士和一点点烛光氛围。",
  },
  {
    id: "精致中餐",
    emoji: "🥢",
    title: "精致中餐",
    description: "熟悉的味道，也可以吃得很浪漫。",
  },
  {
    id: "甜品下午茶",
    emoji: "🍰",
    title: "甜品下午茶",
    description: "先吃甜甜的，再去做甜甜的事。",
  },
  {
    id: "男朋友决定",
    emoji: "💗",
    title: "你来决定",
    description: "相信你的品味，今天不想费脑筋啦。",
  },
];

const movies: MovieChoice[] = [
  {
    id: "奥德赛",
    englishTitle: "THE ODYSSEY",
    emoji: "⚔️",
    release: "7月17日",
    status: "明日上映",
    genre: "神话史诗 · IMAX",
    description: "诺兰新作，最适合一起沉浸在大银幕里。",
    tone: "odyssey",
  },
  {
    id: "海洋奇缘（真人版）",
    englishTitle: "MOANA",
    emoji: "🌊",
    release: "7月10日",
    status: "正在热映",
    genre: "冒险 · 歌舞",
    description: "海风、音乐和冒险，是轻松浪漫的约会选项。",
    tone: "moana",
  },
  {
    id: "小黄人与怪兽",
    englishTitle: "MINIONS & MONSTERS",
    emoji: "🍌",
    release: "7月1日",
    status: "正在热映",
    genre: "动画 · 喜剧",
    description: "不费脑筋地一起笑，很适合快乐约会。",
    tone: "minions",
  },
  {
    id: "超女",
    englishTitle: "SUPERGIRL",
    emoji: "☄️",
    release: "6月26日",
    status: "正在热映",
    genre: "动作 · 科幻",
    description: "宇宙冒险和超级英雄，适合想看爽片的晚上。",
    tone: "supergirl",
  },
  {
    id: "玩具总动员5",
    englishTitle: "TOY STORY 5",
    emoji: "🚀",
    release: "6月19日",
    status: "正在热映",
    genre: "动画 · 冒险",
    description: "熟悉的朋友和新故事，温柔又有一点怀旧。",
    tone: "toystory",
  },
];

const timeSlots = [
  { id: "下午 2:00", label: "下午茶", time: "2:00" },
  { id: "傍晚 5:30", label: "看日落", time: "5:30" },
  { id: "晚上 7:00", label: "晚餐时间", time: "7:00" },
  { id: "晚上 9:00", label: "夜猫约会", time: "9:00" },
];

const extras = [
  { id: "想收到花", emoji: "💐", label: "想收到花" },
  { id: "想拍好看照片", emoji: "📷", label: "拍好看照片" },
  { id: "想吃小蛋糕", emoji: "🍓", label: "加一份甜点" },
  { id: "想认真打扮", emoji: "👗", label: "认真打扮一下" },
  { id: "需要男朋友接送", emoji: "🚗", label: "男朋友接送" },
  { id: "想要一个小惊喜", emoji: "✨", label: "偷偷加点惊喜" },
];

const emptyPlan: Plan = {
  activity: "",
  movie: "",
  food: "",
  date: "",
  time: "",
  extras: [],
  note: "",
};

const stepCopy = [
  { kicker: "DATE IDEA 01", title: "这次想和我去哪里？", hint: "选一个最让你心动的，别担心，选哪个我都开心。" },
  { kicker: "DATE IDEA 02", title: "想吃点什么呀？", hint: "约会的灵魂，是喜欢的人和喜欢的味道。" },
  { kicker: "DATE IDEA 03", title: "把时间留给我们", hint: "挑一个舒服的日子，我会提前把这段时间空出来。" },
  { kicker: "DATE IDEA 04", title: "再加一点小心愿", hint: "可以多选，也可以偷偷告诉我任何想法。" },
  { kicker: "ONE LAST LOOK", title: "我们的约会，就这样定啦？", hint: "确认一下，你按下按钮之后我就会收到这份心动清单。" },
];

function getUpcomingDates(): DateChoice[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const targets = [
    { day: 6, note: "最适合约会" },
    { day: 0, note: "慵懒星期天" },
  ];

  return targets.map(({ day, note }) => {
    const date = new Date(today);
    let diff = (day - today.getDay() + 7) % 7;
    if (diff === 0) diff = 7;
    date.setDate(today.getDate() + diff);

    return {
      value: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-"),
      weekday: `周${"日一二三四五六"[day]}`,
      date: `${date.getMonth() + 1}月${date.getDate()}日`,
      note,
    };
  });
}

function formatDate(value: string) {
  if (!value) return "还没有选";
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${month}月${day}日 · 周${"日一二三四五六"[date.getDay()]}`;
}

function getLocalDateValue() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function DatePlanner() {
  const [screen, setScreen] = useState<"intro" | "planner" | "success">("intro");
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<Plan>(emptyPlan);
  const [dates, setDates] = useState<DateChoice[]>([]);
  const [today, setToday] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    setDates(getUpcomingDates());
    setToday(getLocalDateValue());
  }, []);

  const progress = ((step + 1) / stepCopy.length) * 100;

  function updatePlan<Key extends keyof Plan>(key: Key, value: Plan[Key]) {
    setPlan((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function chooseAndContinue(key: "food", value: string) {
    updatePlan(key, value);
    window.setTimeout(() => setStep((current) => Math.min(current + 1, 4)), 180);
  }

  function chooseActivity(value: string) {
    setPlan((current) => ({
      ...current,
      activity: value,
      movie: value === "新片首映夜" ? current.movie : "",
    }));
    setError("");

    if (value === "新片首映夜") {
      window.setTimeout(() => {
        document.getElementById("movie-picker")?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 120);
      return;
    }

    window.setTimeout(() => setStep((current) => Math.min(current + 1, 4)), 180);
  }

  function chooseMovie(value: string) {
    updatePlan("movie", value);
    window.setTimeout(() => setStep(1), 240);
  }

  function toggleExtra(value: string) {
    updatePlan(
      "extras",
      plan.extras.includes(value)
        ? plan.extras.filter((item) => item !== value)
        : [...plan.extras, value],
    );
  }

  function canContinue() {
    if (step === 0) {
      return Boolean(
        plan.activity &&
        (plan.activity !== "新片首映夜" || plan.movie),
      );
    }
    if (step === 1) return Boolean(plan.food);
    if (step === 2) return Boolean(plan.date && plan.time);
    return true;
  }

  function nextStep() {
    if (!canContinue()) {
      setError(
        step === 2
          ? "先选好日期和时间，我才知道什么时候来接你呀。"
          : step === 0 && plan.activity === "新片首映夜"
            ? "再挑一部想看的电影吧。"
            : "先选一个喜欢的答案吧。",
      );
      return;
    }
    setStep((current) => Math.min(current + 1, 4));
  }

  async function submitPlan() {
    setSending(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/date-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...plan,
          website: "",
          startedAt,
          submittedAt: Date.now(),
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        preview?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "发送失败了，请稍后再试一次。");
      }

      setPreviewMode(Boolean(result.preview));
      setScreen("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "发送失败了，请稍后再试一次。",
      );
    } finally {
      setSending(false);
    }
  }

  function resetPlanner() {
    setPlan(emptyPlan);
    setCustomDate("");
    setStep(0);
    setError("");
    setPreviewMode(false);
    setScreen("intro");
  }

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="sparkle-field" aria-hidden="true">
        <span>✦</span>
        <span>✧</span>
        <span>⋆</span>
        <span>✦</span>
        <span>✧</span>
        <span>⋆</span>
        <span>✦</span>
        <span>♡</span>
      </div>

      <header className="topbar">
        <button className="brand" type="button" onClick={resetPlanner} aria-label="回到首页">
          <span className="brand-mark">S</span>
          <span>
            <strong>LOVE PLAN</strong>
            <small>只属于我们的约会企划</small>
          </span>
        </button>
        <div className="topbar-note">
          <span className="status-dot" />
          男朋友正在线等答案
        </div>
      </header>

      {screen === "intro" && (
        <section className="intro-layout screen-enter">
          <div className="intro-copy">
            <div className="eyebrow">
              <span>✦</span> AN INVITATION FOR YOU <span>✦</span>
            </div>
            <h1>
              亲爱的，
              <br />
              <em>这次约会听你的。</em>
            </h1>
            <p className="intro-lead">
              我准备了一份小小的约会选择题。你只要选喜欢的、想吃的和方便的时间，剩下的就全部交给我。
            </p>
            <button
              className="primary-button intro-button"
              type="button"
              onClick={() => {
                setScreen("planner");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              开始挑选我们的约会
              <span>→</span>
            </button>
            <div className="love-footnote">
              <span className="tiny-avatars">🧑🏻‍❤️‍👩🏻</span>
              <span>
                已为你预留 <strong>100%</strong> 的耐心和偏爱
              </span>
            </div>
          </div>

          <div className="intro-visual" aria-label="本周浪漫预告">
            <div className="orbit orbit-one" aria-hidden="true">✦</div>
            <div className="orbit orbit-two" aria-hidden="true">♡</div>
            <div className="polaroid-card">
              <div className="tape" />
              <div className="card-topline">
                <span>WEEKEND</span>
                <span>NO. 01</span>
              </div>
              <div className="heart-scene">
                <span className="big-heart">♥</span>
                <span className="heart-sparkle sparkle-a">✦</span>
                <span className="heart-sparkle sparkle-b">✧</span>
                <span className="heart-sparkle sparkle-c">⋆</span>
              </div>
              <h2>本周浪漫预告</h2>
              <ul>
                <li><span>01</span> 最近上映的新电影</li>
                <li><span>02</span> 世界杯决赛大屏之夜</li>
                <li><span>03</span> 还有一个只给你的惊喜</li>
              </ul>
              <p className="handwriting">Can&apos;t wait to see you ♡</p>
            </div>
            <div className="mini-note note-one">今晚也想见你</div>
            <div className="mini-note note-two">周末请留给我</div>
          </div>
        </section>
      )}

      {screen === "planner" && (
        <section className="planner-wrap screen-enter">
          <div className="progress-header">
            <button
              type="button"
              className="back-link"
              onClick={() => {
                if (step === 0) setScreen("intro");
                else setStep((current) => current - 1);
                setError("");
              }}
            >
              ← {step === 0 ? "返回邀请函" : "上一题"}
            </button>
            <div className="progress-copy">
              <span>心动进度</span>
              <strong>{step + 1} / {stepCopy.length}</strong>
            </div>
          </div>
          <div className="progress-track" aria-label={`完成进度 ${Math.round(progress)}%`}>
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="question-card" key={step}>
            <div className="question-heading">
              <span className="question-kicker">{stepCopy[step].kicker}</span>
              <h2>{stepCopy[step].title}</h2>
              <p>{stepCopy[step].hint}</p>
            </div>

            {step === 0 && (
              <>
                <div className="choice-grid activity-grid">
                  {activities.map((choice) => (
                    <ChoiceCard
                      key={choice.id}
                      choice={choice}
                      selected={plan.activity === choice.id}
                      onClick={() => chooseActivity(choice.id)}
                    />
                  ))}
                </div>

                {plan.activity === "新片首映夜" && (
                  <div className="movie-picker" id="movie-picker">
                    <div className="movie-picker-heading">
                      <div>
                        <span>NOW SHOWING</span>
                        <h3>那我们看哪一部？</h3>
                      </div>
                      <small>北美院线 · 更新于 2026.07.16</small>
                    </div>
                    <div className="movie-grid" aria-label="近期电影片单">
                      {movies.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          selected={plan.movie === movie.id}
                          onClick={() => chooseMovie(movie.id)}
                        />
                      ))}
                    </div>
                    <p className="swipe-hint">左右滑动查看更多电影 <span>→</span></p>
                  </div>
                )}
              </>
            )}

            {step === 1 && (
              <div className="choice-grid food-grid">
                {foods.map((choice) => (
                  <ChoiceCard
                    key={choice.id}
                    choice={choice}
                    selected={plan.food === choice.id}
                    onClick={() => chooseAndContinue("food", choice.id)}
                  />
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="time-section">
                <fieldset className="date-fieldset">
                  <legend>先选日子</legend>
                  <div className="date-grid">
                    {dates.map((date) => (
                      <button
                        type="button"
                        key={date.value}
                        className={`date-option ${plan.date === date.value ? "selected" : ""}`}
                        onClick={() => {
                          updatePlan("date", date.value);
                          setCustomDate("");
                        }}
                        aria-pressed={plan.date === date.value}
                      >
                        <span>{date.weekday}</span>
                        <strong>{date.date}</strong>
                        <small>{date.note}</small>
                      </button>
                    ))}
                    <label className={`date-option custom-date ${customDate ? "selected" : ""}`}>
                      <span>其他日期</span>
                      <strong>{customDate ? formatDate(customDate).split(" · ")[0] : "我来挑一天"}</strong>
                      <small>打开日历选择</small>
                      <input
                        type="date"
                        min={today}
                        value={customDate}
                        onChange={(event) => {
                          setCustomDate(event.target.value);
                          updatePlan("date", event.target.value);
                        }}
                        aria-label="选择其他约会日期"
                      />
                    </label>
                  </div>
                </fieldset>

                <fieldset className="date-fieldset">
                  <legend>再选时间</legend>
                  <div className="time-grid">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot.id}
                        className={`time-option ${plan.time === slot.id ? "selected" : ""}`}
                        onClick={() => updatePlan("time", slot.id)}
                        aria-pressed={plan.time === slot.id}
                      >
                        <span>{slot.label}</span>
                        <strong>{slot.time}</strong>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 3 && (
              <div className="extras-section">
                <div className="extras-grid">
                  {extras.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`extra-pill ${plan.extras.includes(item.id) ? "selected" : ""}`}
                      onClick={() => toggleExtra(item.id)}
                      aria-pressed={plan.extras.includes(item.id)}
                    >
                      <span>{item.emoji}</span>
                      {item.label}
                      <i>{plan.extras.includes(item.id) ? "✓" : "+"}</i>
                    </button>
                  ))}
                </div>
                <label className="note-field">
                  <span>
                    还有什么想悄悄告诉我？
                    <small>选填</small>
                  </span>
                  <textarea
                    maxLength={300}
                    value={plan.note}
                    onChange={(event) => updatePlan("note", event.target.value)}
                    placeholder="比如：想去安静一点的地方、想穿新裙子、那天不要安排太早……"
                  />
                  <i>{plan.note.length} / 300</i>
                </label>
              </div>
            )}

            {step === 4 && (
              <div className="review-section">
                <div className="review-ticket">
                  <div className="ticket-heading">
                    <div>
                      <span>OUR DATE TICKET</span>
                      <h3>一张通往快乐的双人票</h3>
                    </div>
                    <span className="ticket-heart">♥</span>
                  </div>
                  <ReviewRow
                    icon="🎟️"
                    label="约会安排"
                    value={
                      plan.activity === "新片首映夜"
                        ? `${plan.activity} · 《${plan.movie}》`
                        : plan.activity
                    }
                    onEdit={() => setStep(0)}
                  />
                  <ReviewRow
                    icon="🍽️"
                    label="想吃什么"
                    value={plan.food}
                    onEdit={() => setStep(1)}
                  />
                  <ReviewRow
                    icon="🗓️"
                    label="约会时间"
                    value={`${formatDate(plan.date)} · ${plan.time}`}
                    onEdit={() => setStep(2)}
                  />
                  <ReviewRow
                    icon="✨"
                    label="小小心愿"
                    value={plan.extras.length ? plan.extras.join("、") : "只要和你在一起就好"}
                    onEdit={() => setStep(3)}
                  />
                  {plan.note && (
                    <div className="review-note">
                      <span>“</span>
                      {plan.note}
                      <span>”</span>
                    </div>
                  )}
                  <div className="ticket-footer">
                    <span>VALID FOR TWO</span>
                    <span>LOVE NEVER EXPIRES</span>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="error-message" role="alert">{error}</p>}

            <div className="question-actions">
              {step < 4 ? (
                <button
                  type="button"
                  className="primary-button"
                  onClick={nextStep}
                  disabled={!canContinue()}
                >
                  {step === 3 ? "看看我们的约会单" : "就选这个，下一题"}
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-button submit-button"
                  onClick={submitPlan}
                  disabled={sending}
                >
                  {sending ? "正在把心意送出去…" : "确认约会，通知男朋友"}
                  <span>{sending ? "♡" : "💌"}</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {screen === "success" && (
        <section className="success-wrap screen-enter">
          <div className="success-card">
            <div className="success-burst" aria-hidden="true">
              <span>✦</span>
              <span>✧</span>
              <span>♥</span>
              <span>⋆</span>
              <div>💌</div>
            </div>
            <span className="success-kicker">DATE CONFIRMED</span>
            <h1>
              {previewMode ? "这份心动清单准备好啦" : "已经发到男朋友邮箱啦"}
              <em>！</em>
            </h1>
            <p>
              {previewMode
                ? "现在是本地预览模式。配置好邮件发送密钥后，下一次提交就会直接发送到他的 Gmail。"
                : "你的答案已经悄悄飞进他的 Gmail。接下来，请保持期待，等他把这场约会变成真的。"}
            </p>
            <div className="success-summary">
              <span>
                <small>我们要去</small>
                <strong>
                  {plan.movie ? `看《${plan.movie}》` : plan.activity}
                </strong>
              </span>
              <i>＋</i>
              <span>
                <small>我们要吃</small>
                <strong>{plan.food}</strong>
              </span>
              <i>＋</i>
              <span>
                <small>约在</small>
                <strong>{formatDate(plan.date)}</strong>
              </span>
            </div>
            <div className="success-quote">
              “谢谢你愿意把时间留给我，期待见到那天漂漂亮亮的你。”
              <span>— 你的男朋友 ♡</span>
            </div>
            <button type="button" className="ghost-button" onClick={resetPlanner}>
              再看一遍邀请函
            </button>
          </div>
        </section>
      )}

      <footer>
        MADE WITH <span>♥</span> FOR MY FAVORITE PERSON
      </footer>
    </main>
  );
}

function ChoiceCard({
  choice,
  selected,
  onClick,
}: {
  choice: Choice;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`choice-card ${selected ? "selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {choice.badge && <span className="choice-badge">{choice.badge}</span>}
      <span className="choice-emoji">{choice.emoji}</span>
      <span className="choice-copy">
        <strong>{choice.title}</strong>
        <small>{choice.description}</small>
      </span>
      <i className="select-mark">{selected ? "✓" : "→"}</i>
    </button>
  );
}

function MovieCard({
  movie,
  selected,
  onClick,
}: {
  movie: MovieChoice;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`movie-card ${movie.tone} ${selected ? "selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="movie-art">
        <span className="movie-status">{movie.status}</span>
        <strong>{movie.emoji}</strong>
        <small>{movie.englishTitle}</small>
      </span>
      <span className="movie-info">
        <strong>{movie.id}</strong>
        <small>{movie.genre}</small>
        <span>{movie.release}</span>
        <p>{movie.description}</p>
      </span>
      <i>{selected ? "✓" : "选择"}</i>
    </button>
  );
}

function ReviewRow({
  icon,
  label,
  value,
  onEdit,
}: {
  icon: string;
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="review-row">
      <span className="review-icon">{icon}</span>
      <span className="review-copy">
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
      <button type="button" onClick={onEdit}>修改</button>
    </div>
  );
}
