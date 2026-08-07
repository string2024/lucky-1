# Supabase 자동 중지 방지

Supabase 무료 플랜은 **7일간 접속이 없으면 프로젝트가 자동 일시중지**됩니다.
중지되면 앱에서 DB를 읽고 쓸 수 없습니다.

이걸 막으려고 **3일마다 자동 접속하는 장치**를 만들어 뒀습니다.

- 파일: `.github/workflows/keep-supabase-alive.yml`
- 대상: **lucky-1**(가져봐1등), **follicle-iq**(FollicleIQ)

---

## 사장님이 하실 일 — 명령어 3줄이 전부입니다

Windows에서 **PowerShell** 또는 **명령 프롬프트**를 열고 아래를 그대로 복사해 붙여넣으세요.

```
cd C:\Users\user\toss-apps\lucky-1
git add .github/workflows/keep-supabase-alive.yml KEEP-ALIVE-설정방법.md
git commit -m "chore: Supabase 자동 중지 방지 워크플로 추가"
git push
```

> 💡 이 폴더에 아직 커밋 안 한 다른 변경사항이 많습니다.
> 위 명령은 **이 두 파일만** 올리므로 나머지는 그대로 남습니다. 안전합니다.

---

## 잘 됐는지 확인 (1분)

1. https://github.com/string2024/lucky-1 접속
2. 상단 **Actions** 탭 클릭
3. 왼쪽에서 **Keep Supabase Alive** 클릭
4. 오른쪽 **Run workflow** → 초록 버튼 클릭
5. 1분쯤 뒤 새로고침

**성공하면 이렇게 나옵니다:**

```
ping lucky-1
  lucky-1 → HTTP 200
  ✅ lucky-1 살아있음

ping follicle-iq
  follicle-iq → HTTP 200
  ✅ follicle-iq 살아있음
```

빨간 ❌ 가 뜨면 해당 프로젝트가 이미 중지된 상태일 수 있습니다.
Supabase 대시보드에서 `Resume project` 눌러 살린 뒤 다시 실행하세요.

---

## 이후에는

**아무것도 안 하셔도 됩니다.** 3일마다 알아서 돌아갑니다.
실패하면 GitHub이 등록된 이메일로 알림을 보내줍니다.

---

## 자주 묻는 것

**Q. 키를 파일에 그대로 적어도 되나요?**

네. 여기 쓴 건 Supabase의 **anon(publishable) 키**로, 원래 앱 파일에 포함되어 배포되는 공개용 값입니다.
데이터 보호는 RLS 정책이 담당합니다.

⚠️ 단, **`service_role` / `secret` 키는 절대 넣지 마세요.** 그건 진짜 위험합니다.

**Q. 나중에 프로젝트를 추가하려면?**

`keep-supabase-alive.yml` 의 `matrix.include` 아래에 3줄만 추가하면 됩니다.

```yaml
          - name: 프로젝트이름
            url: https://xxxxx.supabase.co
            key: (해당 프로젝트의 anon/publishable 키)
```

**Q. 왜 3일마다인가요?**

Supabase 기준이 7일인데, 주 1회(7일)로 하면 마진이 없습니다.
워크플로가 한 번만 실패해도 바로 잠기기 때문에 절반인 3일로 잡았습니다.

---

## 현재 Supabase 프로젝트 현황 (2026-08-08)

| 프로젝트 | Reference ID | 쓰는 앱 | 상태 |
|---|---|---|---|
| follicle-iq | estfcrkcydxbfytiugxx | FollicleIQ (출시·홍보 중) | ✅ keep-alive 적용 |
| lucky-1 | tfttnboapstboxsvwvqw | 가져봐1등 | ✅ keep-alive 적용 |
| saju-tarot-battle | zjhrobezhdfxkmiolhex | **없음** (유령 프로젝트) | ⏸️ 일시중지, 2027-06-07까지 복구 가능 |

**DB를 쓰지 않는 앱:** 복꺼비, 가끔 이상한 나, 케어펫
**운명타로:** Lovable 계정 DB 사용 — `mystic-talk-ai` 저장소에 별도 워크플로가 이미 있음
