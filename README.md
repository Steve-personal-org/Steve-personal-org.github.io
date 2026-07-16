# 我们的约会企划

一个专门做给女朋友的中文约会选择网站。她可以选择想做的事、想吃的东西、日期、时间和额外小心愿；确认后，完整的约会清单会发送到男朋友的邮箱。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。

## 配置 Gmail 通知

所有邮箱地址和密钥都只保存在服务器端，不会暴露给访客。网站通过 Resend 安全投递到指定 Gmail。

1. 注册 [Resend](https://resend.com) 并创建 API Key。
2. 填写：
   - `RESEND_API_KEY`：Resend API Key。
   - `DATE_NOTIFICATION_EMAIL`：接收约会结果的邮箱。
   - `DATE_SENDER_EMAIL`：发件人。测试时可使用默认值；正式使用建议配置自己的已验证域名。

部署时，把相同变量添加到网站的环境变量中。没有配置发送密钥时，本地环境会进入预览模式，方便完整测试选择流程；生产环境不会假装邮件已经送达。

## 可定制内容

- 约会和食物选项：`app/DatePlanner.tsx`
- 页面文字、颜色和闪亮效果：`app/globals.css`
- 邮件模板和发送逻辑：`app/api/date-request/route.ts`

## 构建

```bash
npm run build
```
