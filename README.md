# PKK KBZ Listener

PKK KBZ Listener သည် merchant Android phone တွင် ဝင်လာသော **valid KBZPay merchant payment SMS** များကို စစ်ဆေး၊ parse၊ local-first queue ထဲသိမ်းပြီး VPS API သို့ HTTPS POST ဖြင့် ပို့ရန် ရည်ရွယ်ထားသော Phase 1 utility ဖြစ်သည်။ Telegram verification၊ customer last-six verification၊ screenshot OCR၊ MytelPay နှင့် operator auto-purchase များ မပါဝင်ပါ။

## Requirements and installation

Android 8.0 / API 26 သို့မဟုတ် အထက် ဖုန်းလိုအပ်သည်။ APK ကို GitHub Actions ၏ `PKK-KBZ-Listener-debug` artifact မှ download လုပ်ပြီး sideload/install လုပ်ပါ။ Install ပြီးနောက် Android Settings → Apps → PKK KBZ Listener → Permissions မှ SMS permission ကို ခွင့်ပြုပါ။ Battery optimization/background restriction များကို merchant phone policy နှင့် ကိုက်ညီသလို ဖြေလျှော့ရန်လိုနိုင်သည်။ Android policy သည် SMS receiver ကို ပိတ်ထားလျှင် app က Permission Required/Error အဖြစ် ပြသရမည်။

## Configuration

Settings တွင် API URL၊ Device ID နှင့် Device Secret ထည့်ပါ။ Production URL သည် `https://` ဖြစ်ရမည်။ Device Secret ကို Android Keystore-backed secure storage တွင် သိမ်းရန် ရည်ရွယ်ထားပြီး source code၊ GitHub၊ UI dashboard၊ log များတွင် မထည့်ရပါ။ Test Server Connection ဖြင့် endpoint ကို စမ်းပါ။

## Parsing rules

Payment SMS သည် `Dear KBZPay partner`၊ `received payment of`၊ amount + `Ks`၊ date နှင့် numeric `Txn ID` အားလုံးပါမှသာ valid ဖြစ်သည်။ Multipart SMS parts များကို ပေါင်းပြီးမှ parse လုပ်ရမည်။ Full transaction ID သည် String ဖြစ်ပြီး leading zero မပျောက်ရပါ။ `txn_last6` သည် full ID ၏ `slice(-6)` ဖြစ်သည်။ ပေးထားသော sample 3 တွင် full ID `01004258060011717896` ၏ သင်္ချာအရ နောက်ဆုံး ၆ လုံးမှာ `717896` ဖြစ်သည်၊ `117896` မဟုတ်ပါ။

## VPS request contract

```json
{
  "provider": "KBZPAY_SMS",
  "txn_id": "01004258060011717896",
  "txn_last6": "717896",
  "amount": 101000,
  "payment_date": "29/08/2026",
  "sender": "actual_android_sender",
  "device_received_at": "2026-08-29T12:34:56.000Z",
  "raw_sms": "original SMS text"
}
```

Headers are `Content-Type: application/json`, `X-Device-ID`, `X-Timestamp`, and `X-Signature`. The canonical signing string is `timestamp|device_id|txn_id|amount|device_received_at`; `X-Signature` is lowercase hexadecimal HMAC-SHA256 using Device Secret as the key. Server responses must be validated. HTTP 409/already-exists is treated as already synced rather than retried forever. HTTPS certificate verification must remain enabled.

## Reliability and duplicate protection

A valid transaction must be saved locally before upload. The intended states are `PENDING`, `UPLOADING`, `SENT`, and `FAILED`, with retry count and last error retained. Network/VPS failures must not delete the locally saved item. Retry uses exponential backoff after connectivity returns. Full `txn_id` is unique, so the same SMS cannot create a second local transaction.

## GitHub Actions

Workflow `.github/workflows/android.yml` runs on pushes to `main`, `v*` tags, and manual dispatch. It installs dependencies, runs unit tests and type checks, generates the Android project, builds `app-debug.apk`, and uploads the artifact named `PKK-KBZ-Listener-debug`. Version tags also attach the APK to a GitHub Release.

## Local development

Run `npm install`, then `npm test -- --run` and `npm run check`. Use `npx expo start` for the UI preview. The native SMS receiver requires an Android development build; Expo Go cannot provide arbitrary custom native SMS receiver behavior. Before production use, verify the receiver and background delivery on the actual merchant phone, inspect the actual Android originating address in the event log, and test with harmless controlled SMS fixtures.

## Troubleshooting

If status is Permission Required, grant SMS permission and reopen the app. If sender differs from the Messages app label, use the actual `originatingAddress` returned by Android rather than hard-coding `KBZPay`. If uploads remain pending, check HTTPS URL, network access, VPS availability, device clock, and server HMAC canonicalization. Never print Device Secret or HMAC key material in logs.
