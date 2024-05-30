import RevokedToken from './schema';

export default class RevokedTokenService {
  public async revokeToken(token: string): Promise<void> {
    const revokedToken = new RevokedToken({ token });
    await revokedToken.save();
  }

  public async isTokenRevoked(token: string): Promise<boolean> {
    const revokedToken = await RevokedToken.findOne({ token });
    return !!revokedToken;
  }
}
