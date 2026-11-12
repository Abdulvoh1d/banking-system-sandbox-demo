# Banking System Sandbox

Northstar Personal — namunaviy hisoblar va tranzaksiyalarni ko‘rsatib, brauzer ichida tekshiriladigan simulyatsiya transferini bajaradigan, haqiqiy bank xizmatlariga ulanmaydigan demo ilova.

## Havolalar

- [Jonli demo](https://banking-system-sandbox-demo.netlify.app)
- [GitHub repository](https://github.com/Abdulvoh1d/banking-system-sandbox-demo)

## Loyiha nimani ko‘rsatadi

Loyiha shaxsiy bank panelining namunaviy ko‘rinishini namoyish etadi: hisoblar va ularning balanslari, jamlangan hamda oylik kirim-chiqim ko‘rsatkichlari, tranzaksiyalar jurnali va hisoblar orasida simulyatsiya transferini ko‘rib tasdiqlash jarayoni. Interfeysdagi barcha bank ma’lumotlari demo uchun yaratilgan.

## Tasdiqlangan funksiyalar

- Ikki namunaviy hisobni — **Everyday Checking** va **Growth Savings** — hamda ularning balanslari va jami balansni ko‘rish.
- Namunaviy jurnal asosida oylik kirim va chiqim summalarini ko‘rish.
- Tranzaksiyalarni hisob bo‘yicha filtrlash, barcha faoliyat yoki transferlarni ajratish va matn orqali qidirish.
- Hisoblar orasidagi demo transferini tuzish: manba va manzilni tanlash yoki almashtirish, miqdor hamda ixtiyoriy 60 belgigacha izoh kiritish.
- Transferni tasdiqlashdan oldin tafsilotlarini ko‘rib chiqish. Ilova hisoblar turlicha ekanini, miqdor musbat va ko‘pi bilan ikki kasr xonali ekanini, namunaviy balans yetarliligini va demo limiti — **1 000 000 AQSh dollari** — oshmaganini tekshiradi.
- Tasdiqlanganda, faqat simulyatsiya doirasida ikkala namunaviy balansni yangilash va jurnalda kirim-chiqim yozuvlarini yaratish.
- Demo holatini shu brauzerning `localStorage` xotirasida saqlash; yuqoridagi tiklash tugmasi orqali dastlabki namunaviy ma’lumotlarga qaytish.

## Texnologiyalar

- **HTML5** — sahifa tuzilishi va formalar.
- **CSS3** — ko‘rinish va turli ekran o‘lchamlariga moslashuvchi maket.
- **Vanilla JavaScript** — interfeys, namunaviy ma’lumotlar va simulyatsiya mantiqi.
- **Brauzer API’lari:** DOM, `localStorage`, HTML `<dialog>` elementlari, `window.confirm()` va `setTimeout()`; valyuta hamda sanalarni ko‘rsatishda `Intl`.

Framework, server, ma’lumotlar bazasi yoki tashqi bank/payment integratsiyasi ishlatilmaydi. Loyihani ishga tushirish uchun `npm install` yoki build bosqichi kerak emas.

## Talablar va mahalliy ishga tushirish

Git va Python 3 o‘rnatilgan bo‘lishi, zamonaviy brauzer ishlatilishi kerak. Terminalda quyidagilarni bajaring:

```bash
git clone https://github.com/Abdulvoh1d/banking-system-sandbox-demo.git
cd banking-system-sandbox-demo
python3 -m http.server 8765
```

So‘ng brauzerda [http://localhost:8765](http://localhost:8765) manzilini oching. Server ishlayotgan terminal oynasini yopmasdan qoldiring.

## Fayl tuzilishi

```text
banking-system-sandbox-demo/
├── index.html   # Demo paneli va dialoglar tuzilishi
├── app.js       # Namuna holati, UI va transfer simulyatsiyasi
├── styles.css   # Uslublar va moslashuvchi maket
└── README.md    # Loyiha haqida ma’lumot va ishga tushirish yo‘riqnomasi
```

## Ma’lumotlar, maxfiylik va demo chegaralari

**Bu haqiqiy bank ilovasi emas.** Hisoblar, balanslar va tranzaksiyalar — faqat namunaviy ma’lumotlar. Transferni tasdiqlash ham brauzerdagi namunaviy balans va jurnalni o‘zgartiradigan simulyatsiyadir: u haqiqiy hisob, bank yoki to‘lov tarmog‘iga ulanmaydi va haqiqiy pul o‘tkazmaydi. Haqiqiy moliyaviy operatsiyalar uchun foydalanmang.

Ilovaning holati joriy brauzerning `localStorage` xotirasida saqlanadi; boshqa brauzer yoki qurilmaga sinxronlanmaydi. Brauzer ma’lumotlarini tozalash demo holatini ham o‘chirishi mumkin. Bu xotira maxfiy ma’lumotlarni himoyalash vositasi emas — haqiqiy bank, karta yoki maxfiy hisob ma’lumotlarini kiritmang.

## Litsenziya

Repository’da `LICENSE` fayli yo‘q. Ommaviy GitHub repository mavjudligi o‘z-o‘zidan ochiq litsenziya berilganini anglatmaydi.
