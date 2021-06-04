//https://stackoverflow.com/a/53573115
require('dotenv').config();
const crypto = require('crypto');
const { Buffer } = require('buffer');

const ALGORITHM = {
  // GCM is an authenticated encryption mode that not only provides confidentiality but also provides integrity in a secured way
  BLOCK_CIPHER: process.env.CIPHER,
  // 128 bit auth tag is recommended for GCM
  AUTH_TAG_BYTE_LEN: parseInt(process.env.AUTH_TAG_BYTE_LEN),
  // NIST recommends 96 bits or 12 bytes IV for GCM to promote interoperability, efficiency, and simplicity of design
  IV_BYTE_LEN: parseInt(process.env.IV_BYTE_LEN),
  // NOTE: 256 (in algorithm name) is key size (block size for AES is always 128)
  KEY_BYTE_LEN: parseInt(process.env.KEY_BYTE_LEN),
  // to prevent rainbow table attacks
  SALT_BYTE_LEN: parseInt(process.env.SALT_BYTE_LEN)
};

module.exports = {
  getRandomKey() {
    return crypto.randomBytes(ALGORITHM.KEY_BYTE_LEN);
  },

  // to prevent rainbow table attacks
  getSalt() {
    return crypto.randomBytes(ALGORITHM.SALT_BYTE_LEN);
  },

  /**
   *
   * @param {Buffer} password - The password to be used for generating key
   *
   * To be used when key needs to be generated based on password.
   * The caller of this function has the responsibility to clear
   * the Buffer after the key generation to prevent the password
   * from lingering in the memory
   */
  getKeyFromPassword(password, salt) {
    return crypto.scryptSync(password, salt, ALGORITHM.KEY_BYTE_LEN);
  },

  /**
   *
   * @param {Buffer} messagetext - The clear text message to be encrypted
   * @param {Buffer} key - The key to be used for encryption
   *
   * The caller of this function has the responsibility to clear
   * the Buffer after the encryption to prevent the message text
   * and the key from lingering in the memory
   */
  encrypt(messagetext, key) {
    const iv = crypto.randomBytes(ALGORITHM.IV_BYTE_LEN);
    const cipher = crypto.createCipheriv(ALGORITHM.BLOCK_CIPHER, key, iv, {
      authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN
    });
    let encryptedMessage = cipher.update(messagetext);
    encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
    return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()]);
  },

  /**
   *
   * @param {Buffer} ciphertext - Cipher text
   * @param {Buffer} key - The key to be used for decryption
   *
   * The caller of this function has the responsibility to clear
   * the Buffer after the decryption to prevent the message text
   * and the key from lingering in the memory
   */
  decrypt(ciphertext, key) {
    const authTag = ciphertext.slice(-16);
    const iv = ciphertext.slice(0, 12);
    const encryptedMessage = ciphertext.slice(12, -16);
    const decipher = crypto.createDecipheriv(ALGORITHM.BLOCK_CIPHER, key, iv, {
      authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN
    });
    decipher.setAuthTag(authTag);
    const messagetext = decipher.update(encryptedMessage);
    return Buffer.concat([messagetext, decipher.final()]);
  }
};


/* const assert = require('assert');
const cryptoUtils = require('../lib/crypto_utils');
describe('CryptoUtils', function() {
  describe('decrypt()', function() {
    it('should return the same mesage text after decryption of text encrypted with a '
     + 'randomly generated key', function() {
      let plaintext = 'my message text';
      let key = cryptoUtils.getRandomKey();
      let ciphertext = cryptoUtils.encrypt(plaintext, key);

      let decryptOutput = cryptoUtils.decrypt(ciphertext, key);

      assert.equal(decryptOutput.toString('utf8'), plaintext);
    });

    it('should return the same mesage text after decryption of text excrypted with a '
     + 'key generated from a password', function() {
      let plaintext = 'my message text';
      
       //Ideally the password would be read from a file and will be in a Buffer
       
      let key = cryptoUtils.getKeyFromPassword(
              Buffer.from('mysecretpassword'), cryptoUtils.getSalt());
      let ciphertext = cryptoUtils.encrypt(plaintext, key);
		let decryptOutput = cryptoUtils.decrypt(
					Buffer.from(ciphertext, 'base64'),
					Buffer.from(key, 'base64')
				);
      assert.equal(decryptOutput.toString('utf8'), plaintext);
    });
  });
}); */