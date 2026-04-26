const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: '蠢・磯・岼繧貞・蜉帙＠縺ｦ縺上□縺輔＞縲・ });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ縺ｮ蠖｢蠑上′豁｣縺励￥縺ゅｊ縺ｾ縺帙ｓ縲・ });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: 'Spinel Lab <onboarding@resend.dev>',
      to: 'u2kvviiuueeu2k@gmail.com',
      replyTo: email,
      subject: `縲舌♀蝠上＞蜷医ｏ縺帙・{name} 讒倥ｈ繧柿,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f4f5f7;padding:32px;">
          <div style="background:#fff;border-radius:8px;padding:36px;border-top:4px solid #f97316;">
            <h2 style="color:#1a1a2e;margin:0 0 24px;font-size:20px;">譁ｰ縺励＞縺雁撫縺・粋繧上○縺悟ｱ翫″縺ｾ縺励◆</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <th style="text-align:left;padding:12px 16px 12px 0;width:90px;color:#888;font-weight:600;border-bottom:1px solid #eee;vertical-align:top;">縺雁錐蜑・/th>
                <td style="padding:12px 0;border-bottom:1px solid #eee;color:#333;">${name}</td>
              </tr>
              <tr>
                <th style="text-align:left;padding:12px 16px 12px 0;color:#888;font-weight:600;border-bottom:1px solid #eee;">繝｡繝ｼ繝ｫ</th>
                <td style="padding:12px 0;border-bottom:1px solid #eee;"><a href="mailto:${email}" style="color:#f97316;">${email}</a></td>
              </tr>
              <tr>
                <th style="text-align:left;padding:12px 16px 12px 0;color:#888;font-weight:600;vertical-align:top;">縺雁撫縺・粋繧上○蜀・ｮｹ</th>
                <td style="padding:12px 0;color:#333;white-space:pre-wrap;line-height:1.7;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
              </tr>
            </table>
            <p style="margin:24px 0 0;font-size:12px;color:#aaa;">縺薙・繝｡繝ｼ繝ｫ縺ｯSpinel Lab縺ｮ縺雁撫縺・粋繧上○繝輔か繝ｼ繝縺九ｉ閾ｪ蜍暮∽ｿ｡縺輔ｌ縺ｾ縺励◆縲・/p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: '繝｡繝ｼ繝ｫ縺ｮ騾∽ｿ｡縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲よ凾髢薙ｒ縺翫＞縺ｦ蜀榊ｺｦ縺願ｩｦ縺励￥縺縺輔＞縲・ });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend exception:', err);
    return res.status(500).json({ error: '繝｡繝ｼ繝ｫ縺ｮ騾∽ｿ｡縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲よ凾髢薙ｒ縺翫＞縺ｦ蜀榊ｺｦ縺願ｩｦ縺励￥縺縺輔＞縲・ });
  }
};
