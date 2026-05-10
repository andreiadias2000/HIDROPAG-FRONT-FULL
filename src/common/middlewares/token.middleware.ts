import { NextFunction, Request, Response } from "express";
import { LoginService } from "../../usuarios/login.service";

export class TokenMiddleware {
    constructor (private service: LoginService) {}

    verificarAcesso = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.get("Authorization");

        if (authHeader) {
            try {
                // O header vem como "Bearer <token>"
                // Dividimos a string pelo espaço e pegamos a segunda parte [1]
                const partes = authHeader.split(' ');
                
                if (partes.length !== 2) {
                    return res.status(401).json({ erro: "Formato do token inválido" });
                }

                const tokenLimpo = partes[1];

                // Agora sim, validamos apenas o código do token
                await this.service.validarToken(tokenLimpo);
                next();
            }
            catch (err: any) {
                // Se o JWT estiver expirado ou a SECRET estiver errada no .env
                res.status(401).json({ erro: "Token inválido ou expirado" });
            }
        } 
        else {
            res.status(401).json({ erro: "Nenhum Token informado!" });    
        }       
    }
}