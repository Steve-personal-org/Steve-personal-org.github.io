import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the birthday confirmation gate", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="zh-CN"/i);
  assert.match(html, /先确认一下/);
  assert.match(html, /输入你的生日/);
  assert.match(html, /确认生日，打开邀请/);
  assert.match(html, /LOVE PLAN/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("includes the current movie picker and weekend-only suggestions", async () => {
  const source = await readFile(
    new URL("../app/DatePlanner.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /奥德赛/);
  assert.match(source, /海洋奇缘（真人版）/);
  assert.doesNotMatch(source, /蜘蛛侠|SPIDER-MAN|spiderman/);
  assert.match(source, /id="movie-picker"/);
  assert.match(source, /\{ day: 6, note: "最适合约会" \}/);
  assert.match(source, /\{ day: 0, note: "慵懒星期天" \}/);
  assert.doesNotMatch(source, /\{ day: 5\b|周五/);
});

test("only the requested birthday unlocks the invitation", async () => {
  const source = await readFile(
    new URL("../app/DatePlanner.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /month: "02"/);
  assert.match(source, /day: "02"/);
  assert.match(source, /year: "1997"/);
  assert.match(source, /useState<"birthday" \| "intro" \| "planner" \| "success">\("birthday"\)/);
});
