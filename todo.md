# Project TODO

- [x] Build PKK KBZ Listener mobile dashboard and setup screens
- [x] Implement strict KBZPay merchant SMS parser with multipart normalization
- [x] Preserve full transaction ID as a string and derive the last six digits
- [ ] Implement secure API settings storage and HTTPS VPS upload contract
- [ ] Implement canonical HMAC-SHA256 signing and timeout/error handling
- [ ] Implement local-first transaction queue, duplicate protection, and retry states
- [ ] Add native Android SMS receiver implementation or document build limitation
- [ ] Add unit tests for valid, malformed, unrelated, multiline, and duplicate SMS cases
- [x] Add branded app icon assets and update app configuration
- [x] Add GitHub Actions APK build and artifact workflow
- [x] Add complete README and VPS API contract documentation
- [x] Run type checks and parser unit tests; Android build was attempted but cancelled after a 13-minute Gradle hang
- [x] Create/update private GitHub repository pkk-kbz-listener
- [x] Push source code; GitHub Actions tests/type-check/prebuild passed, APK build did not finish
- [ ] Verify APK artifact PKK-KBZ-Listener-debug

- [x] Set VPS API endpoint to https://pay.kiwihub.top/api/kbzpay/sms and validate HTTPS URL configuration
