import { SetMetadata } from "@nestjs/common"
//O SetMetadata é uma função fornecida pelo NestJS para definir metadados em controladores e manipuladores de rotas.

export const IS_PUBLIC_KEY = 'isPublic'//IS_PUBLIC_KEY com o valor 'isPublic'. Esta constante será usada como uma chave para associar um metadado específico.
export const Ispublic = () => SetMetadata(IS_PUBLIC_KEY, true)


