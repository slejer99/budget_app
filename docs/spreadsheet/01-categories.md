# Category tree

Source: the `Wzorzec kategorii` sheet, which is the single definition of the category
list. Every month sheet and `CAŁY ROK` pull their labels from it by direct cell reference
(e.g. month row 58 is `='Wzorzec kategorii'!B15`), so renaming a category there propagates
everywhere automatically.

Shape is **fixed**: one income group with 15 slots, then 15 expense groups with exactly 10
slots each. Unused slots hold `.` as a placeholder — they are not empty, and they still occupy
a row in every month sheet. **The slot count is not extensible without restructuring the workbook.**

`row` = the row that category occupies in every month sheet.

## Income — `Całkowite przychody` (15 slots)

| row | # | subcategory |
|---|---|---|
| 58 | 1 | Wynagrodzenie |
| 59 | 2 | Wynagrodzenie Partnera / Partnerki |
| 60 | 3 | Premia |
| 61 | 4 | Przychody z premii bankowych |
| 62 | 5 | Odsetki bankowe |
| 63 | 6 | Sprzedaż na Allegro itp. |
| 64 | 7 | Inne przychody |
| 65 | 8 | _(empty slot)_ |
| 66 | 9 | _(empty slot)_ |
| 67 | 10 | _(empty slot)_ |
| 68 | 11 | _(empty slot)_ |
| 69 | 12 | _(empty slot)_ |
| 70 | 13 | _(empty slot)_ |
| 71 | 14 | _(empty slot)_ |
| 72 | 15 | _(empty slot)_ |

## Expenses — 15 groups × 10 slots

### Jedzenie  _(group header row 79 — 5/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 80 | 1 | Jedzenie dom |
| 81 | 2 | Jedzenie miasto |
| 82 | 3 | Jedzenie praca |
| 83 | 4 | Alkohol |
| 84 | 5 | Inne |
| 85 | 6 | _(empty slot)_ |
| 86 | 7 | _(empty slot)_ |
| 87 | 8 | _(empty slot)_ |
| 88 | 9 | _(empty slot)_ |
| 89 | 10 | _(empty slot)_ |

### Mieszkanie / dom  _(group header row 91 — 10/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 92 | 1 | Czynsz |
| 93 | 2 | Woda i kanalizacja |
| 94 | 3 | Prąd |
| 95 | 4 | Gaz |
| 96 | 5 | Ogrzewanie |
| 97 | 6 | Wywóz śmieci |
| 98 | 7 | Konserwacja i naprawy |
| 99 | 8 | Wyposażenie |
| 100 | 9 | Ubezpieczenie nieruchomości |
| 101 | 10 | Inne |

### Transport  _(group header row 103 — 8/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 104 | 1 | Paliwo do auta |
| 105 | 2 | Przeglądy i naprawy auta |
| 106 | 3 | Wyposażenie dodatkowe (opony) |
| 107 | 4 | Ubezpieczenie auta |
| 108 | 5 | Bilet komunikacji miejskiej |
| 109 | 6 | Garaż |
| 110 | 7 | Taxi |
| 111 | 8 | Inne |
| 112 | 9 | _(empty slot)_ |
| 113 | 10 | _(empty slot)_ |

### Telekomunikacja  _(group header row 115 — 10/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 116 | 1 | Telefon 1 |
| 117 | 2 | Telefon 2 |
| 118 | 3 | TV |
| 119 | 4 | Internet |
| 120 | 5 | Inne |
| 121 | 6 | nju mobile |
| 122 | 7 | google one |
| 123 | 8 | youtube |
| 124 | 9 | netflix |
| 125 | 10 | spotify |

### Opieka zdrowotna  _(group header row 127 — 4/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 128 | 1 | Lekarz |
| 129 | 2 | Badania |
| 130 | 3 | Lekarstwa |
| 131 | 4 | Inne |
| 132 | 5 | _(empty slot)_ |
| 133 | 6 | _(empty slot)_ |
| 134 | 7 | _(empty slot)_ |
| 135 | 8 | _(empty slot)_ |
| 136 | 9 | _(empty slot)_ |
| 137 | 10 | _(empty slot)_ |

### Ubranie  _(group header row 139 — 5/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 140 | 1 | Ubranie zwykłe |
| 141 | 2 | Ubranie sportowe |
| 142 | 3 | Buty |
| 143 | 4 | Dodatki |
| 144 | 5 | Inne |
| 145 | 6 | _(empty slot)_ |
| 146 | 7 | _(empty slot)_ |
| 147 | 8 | _(empty slot)_ |
| 148 | 9 | _(empty slot)_ |
| 149 | 10 | _(empty slot)_ |

### Higiena  _(group header row 151 — 5/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 152 | 1 | Kosmetyki |
| 153 | 2 | Środki czystości (chemia) |
| 154 | 3 | Fryzjer |
| 155 | 4 | Kosmetyczka |
| 156 | 5 | Inne |
| 157 | 6 | _(empty slot)_ |
| 158 | 7 | _(empty slot)_ |
| 159 | 8 | _(empty slot)_ |
| 160 | 9 | _(empty slot)_ |
| 161 | 10 | _(empty slot)_ |

### Dzieci  _(group header row 163 — 6/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 164 | 1 | Artykuły szkolne |
| 165 | 2 | Dodatkowe zajęcia |
| 166 | 3 | Wpłaty na szkołę itp. |
| 167 | 4 | Zabawki / gry |
| 168 | 5 | Przedszkole |
| 169 | 6 | Inne |
| 170 | 7 | _(empty slot)_ |
| 171 | 8 | _(empty slot)_ |
| 172 | 9 | _(empty slot)_ |
| 173 | 10 | _(empty slot)_ |

### Rozrywka  _(group header row 175 — 9/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 176 | 1 | Siłownia / Basen |
| 177 | 2 | Kino / Teatr |
| 178 | 3 | Koncerty |
| 179 | 4 | Czasopisma |
| 180 | 5 | Książki |
| 181 | 6 | rzesy |
| 182 | 7 | Hotel / Turystyka |
| 183 | 8 | tance |
| 184 | 9 | szwedzki |
| 185 | 10 | _(empty slot)_ |

### Inne wydatki  _(group header row 187 — 8/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 188 | 1 | Dobroczynność |
| 189 | 2 | Prezenty |
| 190 | 3 | Sprzęt RTV |
| 191 | 4 | Oprogramowanie |
| 192 | 5 | Edukacja / Szkolenia |
| 193 | 6 | Usługi inne |
| 194 | 7 | Podatki |
| 195 | 8 | Inne |
| 196 | 9 | _(empty slot)_ |
| 197 | 10 | _(empty slot)_ |

### Spłata długów  _(group header row 199 — 8/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 200 | 1 | Kredyt hipoteczny |
| 201 | 2 | kredyt downpayment |
| 202 | 3 | kredyt polska |
| 203 | 4 | Inne |
| 204 | 5 | inne |
| 205 | 6 | klarna |
| 206 | 7 | allegro |
| 207 | 8 | psy |
| 208 | 9 | _(empty slot)_ |
| 209 | 10 | _(empty slot)_ |

### Budowanie oszczędności  _(group header row 211 — 8/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 212 | 1 | Fundusz awaryjny, nieregularne, ubezpieczenia |
| 213 | 2 | Fundusz wydatków nieregularnych |
| 214 | 3 | Poduszka finansowa |
| 215 | 4 | Konto emerytalne IKE/IKZE |
| 216 | 5 | Nadpłata długów |
| 217 | 6 | Fundusz: wakacje, prezenty |
| 218 | 7 | Na bok, mieszkanie?, oszczednosci |
| 219 | 8 | Inne |
| 220 | 9 | _(empty slot)_ |
| 221 | 10 | _(empty slot)_ |

### INNE 1  _(group header row 223 — 0/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 224 | 1 | _(empty slot)_ |
| 225 | 2 | _(empty slot)_ |
| 226 | 3 | _(empty slot)_ |
| 227 | 4 | _(empty slot)_ |
| 228 | 5 | _(empty slot)_ |
| 229 | 6 | _(empty slot)_ |
| 230 | 7 | _(empty slot)_ |
| 231 | 8 | _(empty slot)_ |
| 232 | 9 | _(empty slot)_ |
| 233 | 10 | _(empty slot)_ |

### INNE 2  _(group header row 235 — 0/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 236 | 1 | _(empty slot)_ |
| 237 | 2 | _(empty slot)_ |
| 238 | 3 | _(empty slot)_ |
| 239 | 4 | _(empty slot)_ |
| 240 | 5 | _(empty slot)_ |
| 241 | 6 | _(empty slot)_ |
| 242 | 7 | _(empty slot)_ |
| 243 | 8 | _(empty slot)_ |
| 244 | 9 | _(empty slot)_ |
| 245 | 10 | _(empty slot)_ |

### INNE 3  _(group header row 247 — 0/10 slots used)_

| row | # | subcategory |
|---|---|---|
| 248 | 1 | _(empty slot)_ |
| 249 | 2 | _(empty slot)_ |
| 250 | 3 | _(empty slot)_ |
| 251 | 4 | _(empty slot)_ |
| 252 | 5 | _(empty slot)_ |
| 253 | 6 | _(empty slot)_ |
| 254 | 7 | _(empty slot)_ |
| 255 | 8 | _(empty slot)_ |
| 256 | 9 | _(empty slot)_ |
| 257 | 10 | _(empty slot)_ |

