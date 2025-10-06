import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cpf } = await req.json();
    const cpfLimpo = cpf.replace(/[^\d]+/g, "");
    if (cpfLimpo.length !== 11) {
      return NextResponse.json({ valid: false, message: "CPF deve ter 11 dígitos" });
    }

    // validar dígitos verificadores localmente (caso queira)

    // Chamar API de CPF externa
    const plano = "gratis";
    const apiRes = await fetch(
      `https://cpf.legal/api/v1/consulta/${cpfLimpo}?plano=${plano}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CPF_LEGAL_TOKEN}`,  // token no backend
        },
      }
    );

    if (!apiRes.ok) {
      const text = await apiRes.text();
      return NextResponse.json({ valid: false, message: `Erro externo: ${apiRes.status} — ${text}` });
    }

    const data = await apiRes.json();
    if (data.status === "OK") {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, message: data.message || "CPF inválido" });
    }

  } catch (error: any) {
    console.error("Erro na rota validar-cpf:", error);
    return NextResponse.json({ valid: false, message: "Erro interno no servidor" });
  }
}
