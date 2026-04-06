class NoticeOverlay {
    constructor() {
        this.notice = null;
        this.init();
    }

    async init() {
        const seenNotices = JSON.parse(sessionStorage.getItem('seenNotices') || '[]');
        
        try {
            const response = await fetch('/notices/api/active');
            const data = await response.json();
            this.notice = data.notice;
            
            if (this.notice && !seenNotices.includes(this.notice._id)) {
                this.showOverlay();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    showOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'noticeOverlay';
        
        const imageUrl = this.notice.imageFile || this.notice.imageUrl;
        
        overlay.innerHTML = `
            <div class="notice-overlay">
                <div class="notice-modal">
                    <button class="notice-close" onclick="noticeOverlay.close()">✕</button>
                    ${imageUrl ? `<img src="${imageUrl}" class="notice-image">` : ''}
                    <div class="notice-content">
                        <div class="notice-badge">📢 Announcement</div>
                        <h2 class="notice-title">${this.escapeHtml(this.notice.title)}</h2>
                        <div class="notice-date">📅 ${new Date(this.notice.displayFrom).toLocaleDateString()}</div>
                        <div class="notice-message">${this.escapeHtml(this.notice.content).replace(/\n/g, '<br>')}</div>
                        <div class="notice-author">👤 ${this.escapeHtml(this.notice.author)}</div>
                        <button class="notice-button" onclick="noticeOverlay.close()">Got it, thanks! →</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.addStyles();
        document.body.style.overflow = 'hidden';
        this.markAsSeen();
    }

    close() {
        const overlay = document.getElementById('noticeOverlay');
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = '';
        }
    }

    async markAsSeen() {
        try {
            await fetch('/notices/api/seen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noticeId: this.notice._id })
            });
            
            const seenNotices = JSON.parse(sessionStorage.getItem('seenNotices') || '[]');
            seenNotices.push(this.notice._id);
            sessionStorage.setItem('seenNotices', JSON.stringify(seenNotices));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notice-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.85); display: flex; justify-content: center;
                align-items: center; z-index: 9999; animation: fadeIn 0.3s;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .notice-modal {
                background: white; border-radius: 20px; max-width: 500px; width: 90%;
                overflow: hidden; animation: slideUp 0.3s; position: relative;
            }
            @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .notice-close {
                position: absolute; top: 10px; right: 10px; background: white;
                border: none; width: 35px; height: 35px; border-radius: 50%;
                cursor: pointer; font-size: 18px; z-index: 10;
            }
            .notice-image { width: 100%; height: 200px; object-fit: cover; }
            .notice-content { padding: 30px; }
            .notice-badge {
                display: inline-block; background: #FF385C; color: white;
                padding: 5px 12px; border-radius: 20px; font-size: 12px;
                margin-bottom: 15px;
            }
            .notice-title { font-size: 24px; margin-bottom: 10px; color: #222; }
            .notice-date { color: #666; font-size: 14px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
            .notice-message { line-height: 1.6; margin-bottom: 20px; color: #444; }
            .notice-author { color: #888; font-size: 14px; margin-bottom: 20px; }
            .notice-button {
                width: 100%; background: #FF385C; color: white; border: none;
                padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold;
            }
            .notice-button:hover { background: #E31C5F; }
        `;
        document.head.appendChild(style);
    }
}

let noticeOverlay;
document.addEventListener('DOMContentLoaded', () => {
    noticeOverlay = new NoticeOverlay();
});