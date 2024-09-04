import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { app } from 'electron'

const { SQUID_MAIN_IV, SQUID_MAIN_KEY } = import.meta.env
const ALGORITHM = 'aes-256-cbc'

export default class FileManager {
  private backupFilePath: string

  private secretKey?: Buffer

  private secretIV?: Buffer

  constructor(
    private readonly filename: string,
    private readonly skipEncryption: boolean = false
  ) {
    this.backupFilePath = path.join(app.getPath('userData'), this.filename)

    if (SQUID_MAIN_IV && SQUID_MAIN_KEY) {
      this.secretKey = Buffer.from(SQUID_MAIN_KEY)
      this.secretIV = Buffer.from(SQUID_MAIN_IV)
    } else {
      this.skipEncryption = true
      console.warn(
        'GitSquid encryption keys were not found. Files will not be encrypted upon saving.'
      )
    }
  }

  read<T = string>(isJSON = true): T {
    const content = fs.readFileSync(this.backupFilePath, { encoding: 'utf-8' })
    const decryptedContent = this.decrypt(content)
    const parsedContent = isJSON ? JSON.parse(decryptedContent) : decryptedContent

    return parsedContent as T
  }

  write(content: unknown): void {
    const parsedContent = typeof content === 'string' ? content : JSON.stringify(content)
    const encryptedContent = this.encrypt(parsedContent)

    fs.writeFile(this.backupFilePath, encryptedContent, (error) => {
      if (error) console.error(error)
    })
  }

  private encrypt(data: string): string {
    if (this.skipEncryption) {
      return data
    }

    const cipher = crypto.createCipheriv(ALGORITHM, this.secretKey!, this.secretIV!)
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  }

  private decrypt(data: string): string {
    if (this.skipEncryption) {
      return data
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, this.secretKey!, this.secretIV!)
    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8')
  }
}
