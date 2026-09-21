# TOMA Coffee Storefront

أحيانًا بناء coffee shop online بيبان كأنه شوية products و `Add to bag` وخلاص.

بس السؤال الحقيقي هنا كان مختلف: إزاي نخلي اختيار القهوة نفسه أسهل؟ وإزاي ندي العميل مساحة يعمل blend شبهه، من غير ما نحوله لواحد بيملأ form طويل ومش فاهم هو بيختار إيه؟

من هنا بدأ TOMA Labs: storefront MVP بيحاول يحوّل الاختيار من browsing عشوائي إلى journey مفهومة — اختار اللحظة، قرّب ذوقك، شوف blend بيتكوّن قدامك، وبعدها كمل للـ bag وWhatsApp.

## What is inside

المشروع عبارة عن React + Vite storefront فيه:

- Home page بتشرح الفكرة وتوصل للـ shop أو Blend Lab.
- Shop page فيها carousel، categories، products، bundles، offers، reviews، وWhatsApp CTA.
- Product pages لكل product أو bundle أو package.
- Blend Lab guided من أربع خطوات: Moment، Coffee، Character، Pack.
- Live preview للـ blend، rule-based TOMA Guide، وcustom quote summary.
- Shared bag state بين الصفحات مع حساب totals وcheckout details.
- WhatsApp checkout message فيه المنتجات، الكميات، الأسعار، الإجمالي، وبيانات التوصيل.
- Login وsignup محليين للـ MVP، مع profile فيه saved blends، preferences، recent orders، وtop three products.
- Admin workspace فيه stats، revenue، order lifecycle، clients، products، bundles، categories، وconfirmation modals.

## The main journey

```text
Home
  ↓
Shop → Product detail → Add to bag
  ↓
Find your coffee → Blend Lab → Live recipe
  ↓
Bag → Checkout details → WhatsApp order handoff
```

الفكرة مش إن كل خطوة تبقى كبيرة. بالعكس، كل screen بتحاول تجاوب سؤال واحد في وقته. لو العميل عايز coffee جاهزة يلاقيها بسرعة، ولو عايز يعمل حاجة على ذوقه يلاقي guided path بدل blank canvas.

## How the code is organized

- `src/pages` — route-level page composition.
- `src/components` — reusable storefront، blend، cart، profile، admin، وauth components.
- `src/context` — shared cart، session، profile، toast، وstorefront state.
- `src/lib` — pricing، catalog، profile state، blend rules، admin data، وWhatsApp checkout formatting.
- `src/styles` — page and shared chrome styles، مع الحفاظ على TOMA palette: espresso، cream، brass، وleaf.
- `test` — state and rule-engine tests للـ storefront، blend builder، profile، admin، وcheckout.

التقسيم ده مهم عشان أي تعديل في navigation أو pricing أو cart flow يفضل له source واحد بدل ما نصلح نفس الفكرة في خمس صفحات مختلفة.

## Run it locally

```bash
npm install
npm run dev
```

افتح الرابط اللي Vite هيطبعه في الـ terminal، غالبًا:

```text
http://localhost:5173
```

Production build وpreview:

```bash
npm run build
npm run preview
```

Run the tests:

```bash
npm test
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Storefront home |
| `/shop` | Products, categories, bundles, offers, and reviews |
| `/product/:slug` | Product, bundle, or package detail |
| `/find-your-coffee` | Guided coffee discovery |
| `/blend-lab` | Custom blend builder |
| `/profile` | Saved blends, preferences, orders, and top products |
| `/login` | Local demo sign-in |
| `/signup` | Local demo account creation |
| `/cart` | Bag, checkout details, and WhatsApp handoff |
| `/why-toma` | Brand and buying rationale |
| `/admin` | Demo operations workspace |

## What is intentionally still MVP

هنا بقا لازم نبقى واضحين: ده static frontend MVP، مش production commerce backend.

- Cart، demo accounts، profile data، وadmin data بتتخزن locally في browser storage.
- Catalog وreviews وprofile activity لسه sample data.
- Prices وdelivery rules الخاصة بالـ custom blends محتاجة live business values.
- WhatsApp هو handoff للطلب، مش payment processor.
- مفيش server-backed inventory، auth provider، payment confirmation، أو order tracking حقيقي لسه.

وده مقصود في المرحلة دي. الأول نثبت إن الـ product journey مفهومة ومريحة، وبعدها نوصلها بـ backend من غير ما نعيد بناء الواجهة من الصفر.

## The next useful step

الخطوة المنطقية بعد الـ MVP هي backend صغير يمسك catalog وinventory وorders وaccounts، مع keeping the current UI contracts stable. ساعتها نقدر نستبدل local state وsample data واحدة واحدة، ونخلي نفس التجربة مبنية على بيانات حقيقية بدل ما نرمي كل اللي اتعمل ونبدأ من جديد.
