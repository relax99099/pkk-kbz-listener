# PKK KBZ Listener — Mobile Interface Design

## Product direction

PKK KBZ Listener သည် merchant Android phone ပေါ်တွင် KBZPay payment SMS ကို အလိုအလျောက်ဖတ်၍ local queue ထဲတွင် အရင်သိမ်းပြီး HTTPS VPS API သို့ HMAC-SHA256 ဖြင့် လုံခြုံစွာ ပို့ပေးမည့် utility app ဖြစ်သည်။ UI သည် portrait orientation နှင့် one-handed usage အတွက် အရေးကြီးဆုံး operational state များကို တစ်ချက်ကြည့်ရုံဖြင့် သိနိုင်အောင် ပြုလုပ်မည်။ Device Secret ကို ပုံမှန်စာသားအဖြစ် မပြပါ။

## Screen list and functions

| Screen | Primary content and functionality |
|---|---|
| Dashboard | Listener status, SMS permission state, server status, last payment summary, upload status, recent event log, and Settings shortcut. |
| Settings / Initial Setup | API URL, Device ID, masked Device Secret, Save Settings, and Test Server Connection. |
| Transaction Detail | Amount, payment date, full string txn_id, txn_last6, actual sender, raw SMS, received timestamp, upload state, retry count, and last error. |
| Event Log | Chronological events such as SMS Received, Parsed Successfully, Saved Locally, Queued, Uploaded Successfully, and Failed. |
| Permission Help | SMS permission and background reliability explanation with Android Settings guidance. |

## Key flows

Initial setup is Launch → permission prompt/help → Settings → enter API URL, Device ID, and Device Secret → Save → Test Connection → Dashboard. The incoming payment flow is SMS arrival → multipart combination → strict merchant pattern validation → parse amount/date/full txn ID/suffix/sender/timestamps → reject duplicate → save locally → queue upload → send HTTPS HMAC request → mark SENT or retain PENDING/FAILED for retry. Offline recovery keeps the transaction locally and retries after connectivity returns. Transaction inspection opens Transaction Detail from the Dashboard or Event Log without exposing secrets.

## Layout and visual language

The Dashboard top area contains the app title and a settings icon. A large rounded card shows Listener Status with both text and indicator: green Running, amber Permission Required, or red Error. A second row presents Server Status and Last Upload Status. The Last Payment card shows amount, last six digits, payment date, and received time; full Txn ID is available in detail view and remains a string so leading zeroes are preserved. The lower section is a FlatList event log and a reachable setup action.

Brand colors are deep indigo **#263B80**, warm gold **#D9A441**, light background **#F6F7FB**, surface **#FFFFFF**, foreground **#182033**, muted **#667085**, success **#16845B**, warning **#B7791F**, error **#C2414B**, and border **#E2E6EF**. Dark mode uses **#111827** background and **#1F2937** surface. Touch targets are at least 44–48 dp, status colors are paired with labels/icons, and all asynchronous actions show loading and error feedback.
