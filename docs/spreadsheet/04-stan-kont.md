# `STAN KONT` — accounts & net worth (unused)

Tracks the end-of-month balance of every account and every debt, one column per month
(`E`–`P`), with an opening-balance column `C` labelled from `'CAŁY ROK'!D2 - 1`.

**Non-zero figures in the entire sheet: 0.** It is a fully intact template that has never
been filled in — every balance is `0`. Treat it as an aspiration, not a requirement, and
confirm during grilling whether net-worth tracking is actually wanted.

## Asset rows (`B12:B42`, 31 slots)

| row | account |
|---|---|
| 12 | Gotówka |
| 13 | Konto oszcz. FA (Fundusz Awaryjny) |
| 14 | Konto oszcz. FWN (Fundusz Wydatków Nieregularnych) |
| 15 | Konto oszcz. Poduszka finansowa |
| 16 | mBank eKonto |
| 17 | mBank eMax |
| 18 | Idea Bank Lokaty |
| 19 | Alior ROR |
| 20 | Alior Konto oszczędnościowe |
| 21 | Millennium Konto 360 |
| 22 | Millennium Konto oszczędnościowe Profit |
| 23 | Wartość inwestycji w TFI |
| 24 | Wartość inwestycji giełdowych |

## Debt rows (`B50:B65`, 16 slots)

| row | debt |
|---|---|
| 50 | Karta kredytowa (niespłacone saldo) |
| 51 | Pożyczka u znajomych |
| 52 | Pożyczki inne |
| 53 | Kredyt konsumencki |
| 54 | Kredyt studencki |
| 55 | Kredyt samochodowy (kapitał do spłaty) * |
| 56 | Kredyt hipoteczny (kapitał do spłaty) * |

## Formulas

```
C10 = ="Stan kont na koniec "&('CAŁY ROK'!D2 - 1)
C44 = =SUM(C12:C42)     (total assets, repeated per month column)
C48 = ="Kapitał do spłaty na koniec "&('CAŁY ROK'!D2 - 1)
```

