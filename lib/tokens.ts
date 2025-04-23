import  prisma  from './prisma'
import { v4 as uuidv4 } from 'uuid'
import { addHours } from 'date-fns'

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4()
    const expires = addHours(new Date(), 24)

    await prisma.verificationToken.deleteMany({
        where: { identifier: email }
    })

    return await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires
        }
    })
}