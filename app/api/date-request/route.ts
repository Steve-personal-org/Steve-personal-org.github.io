type DateRequest = {
  activity?: unknown;
  movie?: unknown;
  food?: unknown;
  date?: unknown;
  time?: unknown;
  extras?: unknown;
  note?: unknown;
  website?: unknown;
  startedAt?: unknown;
  submittedAt?: unknown;
};

const recentSubmissions = new Map<string, number>();
const publicSiteOrigin = "https://steve-personal-org.github.io";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const headers = new Headers();
  if (origin === publicSiteOrigin || origin === new URL(request.url).origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  return headers;
}

function jsonResponse(
  request: Request,
  body: unknown,
  init: ResponseInit = {},
) {
  const headers = corsHeaders(request);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  return Response.json(body, { ...init, headers });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== publicSiteOrigin && origin !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }

  const headers = corsHeaders(request);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  return new Response(null, { status: 204, headers });
}

const allowedActivities = new Set([
  "新片首映夜",
  "世界杯决赛",
  "落日晚餐",
  "城市散步",
  "宅家抱抱",
  "神秘惊喜",
]);

const allowedFoods = new Set([
  "热辣火锅",
  "日料寿司",
  "滋滋烤肉",
  "意面披萨",
  "精致中餐",
  "甜品下午茶",
  "男朋友决定",
]);

const allowedMovies = new Set([
  "奥德赛",
  "海洋奇缘（真人版）",
  "小黄人与怪兽",
  "超女",
  "玩具总动员5",
]);

const allowedTimes = new Set([
  "下午 2:00",
  "傍晚 5:30",
  "晚上 7:00",
  "晚上 9:00",
]);

const allowedExtras = new Set([
  "想收到花",
  "想拍好看照片",
  "想吃小蛋糕",
  "想认真打扮",
  "需要男朋友接送",
  "想要一个小惊喜",
]);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${year}年${month}月${day}日（周${"日一二三四五六"[date.getDay()]}）`;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin && origin !== publicSiteOrigin) {
    return jsonResponse(request, { ok: false, error: "请求来源无效。" }, { status: 403 });
  }

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local";
  const lastSubmission = recentSubmissions.get(ip) || 0;
  if (Date.now() - lastSubmission < 45_000) {
    return jsonResponse(
      request,
      { ok: false, error: "已经收到一份啦，稍等一下再提交。" },
      { status: 429 },
    );
  }

  let body: DateRequest;
  try {
    body = (await request.json()) as DateRequest;
  } catch {
    return jsonResponse(request, { ok: false, error: "提交内容无法读取。" }, { status: 400 });
  }

  if (cleanText(body.website, 100)) {
    return jsonResponse(request, { ok: true });
  }

  const activity = cleanText(body.activity, 30);
  const movie = cleanText(body.movie, 40);
  const food = cleanText(body.food, 30);
  const date = cleanText(body.date, 10);
  const time = cleanText(body.time, 20);
  const note = cleanText(body.note, 300);
  const extras = Array.isArray(body.extras)
    ? body.extras
        .filter((item): item is string => typeof item === "string" && allowedExtras.has(item))
        .slice(0, 6)
    : [];

  if (
    !allowedActivities.has(activity) ||
    (activity === "新片首映夜" && !allowedMovies.has(movie)) ||
    (activity !== "新片首映夜" && Boolean(movie)) ||
    !allowedFoods.has(food) ||
    !allowedTimes.has(time) ||
    !isDate(date)
  ) {
    return jsonResponse(
      request,
      { ok: false, error: "还有约会选项没有填完整，请回去检查一下。" },
      { status: 400 },
    );
  }

  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  const submittedAt = typeof body.submittedAt === "number" ? body.submittedAt : 0;
  if (startedAt && submittedAt && submittedAt - startedAt < 1_500) {
    return jsonResponse(request, { ok: true });
  }

  const safe = {
    activity: escapeHtml(activity),
    movie: escapeHtml(movie),
    food: escapeHtml(food),
    date: escapeHtml(formatDate(date)),
    time: escapeHtml(time),
    extras: extras.map(escapeHtml),
    note: escapeHtml(note),
  };

  const text = [
    "她完成约会选择啦！",
    "",
    `约会安排：${activity}`,
    ...(movie ? [`电影：${movie}`] : []),
    `想吃什么：${food}`,
    `日期：${formatDate(date)}`,
    `时间：${time}`,
    `小小心愿：${extras.length ? extras.join("、") : "没有额外要求"}`,
    `悄悄话：${note || "没有留言"}`,
    "",
    "快去准备一场让她开心的约会吧 ♡",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:32px;background:#fff7f9;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;color:#573642">
      <div style="max-width:620px;margin:0 auto;overflow:hidden;border:1px solid #f2d6df;border-radius:24px;background:#fff;box-shadow:0 20px 45px rgba(138,72,94,.12)">
        <div style="padding:32px 34px 27px;background:linear-gradient(135deg,#f16896,#d8487b);color:#fff">
          <div style="margin-bottom:8px;font-size:11px;font-weight:700;letter-spacing:2px;opacity:.84">DATE REQUEST RECEIVED</div>
          <h1 style="margin:0;font-family:Georgia,'Songti SC',serif;font-size:30px;font-weight:600">她完成约会选择啦 💌</h1>
          <p style="margin:9px 0 0;font-size:13px;line-height:1.7;opacity:.88">请查收这份只发给你的心动清单。</p>
        </div>
        <div style="padding:28px 34px">
          ${[
            ["🎟️", "约会安排", safe.activity],
            ...(safe.movie ? [["🎬", "她想看的电影", `《${safe.movie}》`]] : []),
            ["🍽️", "想吃什么", safe.food],
            ["🗓️", "约会日期", safe.date],
            ["⏰", "约会时间", safe.time],
            ["✨", "小小心愿", safe.extras.length ? safe.extras.join("、") : "没有额外要求"],
          ]
            .map(
              ([icon, label, value]) => `
                <div style="display:flex;align-items:center;gap:14px;padding:15px 0;border-bottom:1px solid #f5e7ec">
                  <div style="width:38px;height:38px;line-height:38px;text-align:center;border-radius:12px;background:#fff0f5;font-size:18px">${icon}</div>
                  <div>
                    <div style="margin-bottom:3px;color:#ad8794;font-size:10px">${label}</div>
                    <div style="color:#694653;font-size:14px;font-weight:700">${value}</div>
                  </div>
                </div>`,
            )
            .join("")}
          ${
            safe.note
              ? `<div style="margin-top:22px;padding:16px 18px;border-left:3px solid #e95a8b;background:#fff8fa;color:#805b68;font-family:Georgia,'Songti SC',serif;font-size:13px;line-height:1.8">“${safe.note}”</div>`
              : ""
          }
          <div style="margin-top:25px;padding:17px;border:1px dashed #edbfd0;border-radius:14px;background:#fff8fa;color:#b04d71;font-size:12px;text-align:center">
            快去准备一场让她开心的约会吧 ♡
          </div>
        </div>
      </div>
    </div>
  `;

  const title = movie
    ? `💌 她想看《${movie}》— 快去准备电影约会吧`
    : `💌 她选择了「${activity}」— 快去准备约会吧`;
  const notifications: Array<Promise<{ channel: string; ok: boolean; detail?: string }>> = [];
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.DATE_NOTIFICATION_EMAIL;

  if (apiKey && recipient) {
    const sender =
      process.env.DATE_SENDER_EMAIL || "我们的约会企划 <onboarding@resend.dev>";
    notifications.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "date-night-site/1.0",
        },
        body: JSON.stringify({
          from: sender,
          to: [recipient],
          subject: title,
          html,
          text,
        }),
      })
        .then(async (response) => ({
          channel: "email",
          ok: response.ok,
          detail: response.ok ? undefined : await response.text(),
        }))
        .catch((error: unknown) => ({
          channel: "email",
          ok: false,
          detail: error instanceof Error ? error.message : "Email request failed",
        })),
    );
  }

  if (!notifications.length) {
    if (process.env.NODE_ENV !== "production") {
      console.info("Date request preview", { activity, movie, food, date, time, extras, note });
      return jsonResponse(request, { ok: true, preview: true });
    }

    return jsonResponse(
      request,
      { ok: false, error: "Gmail 通知还没有配置好，请让你的男朋友检查一下。" },
      { status: 503 },
    );
  }

  const results = await Promise.all(notifications);
  if (!results.some((result) => result.ok)) {
    console.error("All date request notifications failed", results);
    return jsonResponse(
      request,
      { ok: false, error: "通知刚刚迷路了，请再试一次。" },
      { status: 502 },
    );
  }

  const failedChannels = results.filter((result) => !result.ok);
  if (failedChannels.length) {
    console.warn("Some date request notifications failed", failedChannels);
  }

  recentSubmissions.set(ip, Date.now());
  return jsonResponse(request, {
    ok: true,
    channels: results.filter((result) => result.ok).map((result) => result.channel),
  });
}
