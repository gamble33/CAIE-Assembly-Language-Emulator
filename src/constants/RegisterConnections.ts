export interface RegisterConnection {
  reg1: string;
  reg2: string;
  doubleSided: boolean;
}

export const RegisterConnections: RegisterConnection[] = [
  {
    reg1: "CU",
    reg2: "PC",
    doubleSided: false,
  },
  {
    reg1: "CIR",
    reg2: "CU",
    doubleSided: false,
  },
  {
    reg1: "MDR",
    reg2: "ACC",
    doubleSided: false,
  },
  {
    reg1: "MDR",
    reg2: "CIR",
    doubleSided: true
  },
  {
    reg1: "CU",
    reg2: "ALU",
    doubleSided: true,
  },
  {
    reg1: "PC",
    reg2: "MAR",
    doubleSided: false,
  },
  {
    reg1: "ALU",
    reg2: "ACC",
    doubleSided: true,
  },
  {
    reg1: "ALU",
    reg2: "SR",
    doubleSided: true,
  },
  {
    reg1: "CU",
    reg2: "MAR",
    doubleSided: false,
  }
];
