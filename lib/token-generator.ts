// Gera um token de acesso para a plataforma SZ7.
// O token é um identificador interno usado no nosso cassino.

const HOLDERS = [
  "JAMES", "MICHAEL", "ROBERT", "WILLIAM", "DAVID", "RICHARD", "JOSEPH",
  "THOMAS", "CHARLES", "CHRISTOPHER", "DANIEL", "MATTHEW", "ANTONY",
  "MARK", "DONALD", "EDWARD", "BRIAN", "GEORGE", "KENNETH", "STEVEN",
  "PAUL", "KEVIN", "BENJAMIN", "GREGORY", "JOSHUA", "JEREMY", "TYLER"
];

const SURNAMES = [
  "SMITH", "JOHNSON", "WILLIAMS", "BROWN", "JONES", "GARCIA", "MILLER",
  "DAVIS", "RODRIGUEZ", "MARTINEZ", "HERNANDEZ", "LOPEZ", "GONZALEZ",
  "WILSON", "ANDERSON", "TAYLOR", "MOORE", "JACKSON", "MARTIN",
  "LEE", "PEREZ", "THOMPSON", "WHITE", "HARRIS", "SANCHEZ", "CLARK"
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export interface AccessToken {
  code: string;
  holder: string;
  validUntil: string;
  pin: string;
}

export function generateToken(): AccessToken {
  let code = "";
  for (let i = 0; i < 16; i++) {
    code += randInt(0, 9).toString();
  }

  const holder = `${pick(HOLDERS)} ${pick(SURNAMES)}`;

  const year = randInt(2027, 2032);
  const month = randInt(1, 12);
  const validUntil = `${month.toString().padStart(2, "0")}/${year}`;

  const pin = randInt(100, 999).toString();

  return { code, holder, validUntil, pin };
}
