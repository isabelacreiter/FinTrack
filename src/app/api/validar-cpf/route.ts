import { NextRequest, NextResponse } from "next/server";

// Função local para validar CPF
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { cpf } = await req.json();
    const cpfLimpo = cpf.replace(/[^\d]+/g, "");
    if (cpfLimpo.length !== 11) {
      return NextResponse.json({ valid: false, message: "CPF deve ter 11 dígitos" });
    }

    if (!validarCPF(cpfLimpo)) {
      return NextResponse.json({ valid: false, message: "CPF inválido ou inexistente. Use o formato 000.000.000-00" });
    }

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    console.error("Erro na rota validar-cpf:", error);
    return NextResponse.json({ valid: false, message: "Erro interno no servidor" });
  }
}
