import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class CryptUtil {

  /**
   * Generate hash
   * @param {string} password
   * @returns {Promise<string>}
   */
  public static async generateHash(password: string): Promise<string> {

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  }

  /**
   * Compare hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  public static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  public static generateToken(data: { _id: string, uid: string }, jwtSecret: string): string {

    return jwt.sign(
      {
        uid: data.uid,
        _id: data._id
      } as object,
      jwtSecret,
      {expiresIn: '14d'},
    );

  }

}
