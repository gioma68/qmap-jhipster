export interface IE {
  id?: number;
}

export class E implements IE {
  constructor(public id?: number) {}
}

export function getEIdentifier(e: IE): number | undefined {
  return e.id;
}
