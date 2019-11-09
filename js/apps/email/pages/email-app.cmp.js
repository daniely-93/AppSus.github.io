import mailService from '../services/mail-service.js';
import sideMenu from '../components/side-menu.cmp.js';
import emailList from '../components/email-list.cmp.js';
import emailCompose from '../components/email-compose.cmp.js'
import { eventBus } from './../../../services/eventbus-service.js';

export default {
    name: 'Main',
    template: `
    <div class="mail-container">
        <side-menu @clicked="changeDir" @toggleForm="toggleForm" :unread="unreadMails"></side-menu>
        <router-view :mails="filteredMails.length ? filteredMails : mails"></router-view>
        <email-compose v-if="showForm" @sendMail="sendMail" :mailTemplate="mailTemplate"></email-compose>
    </div>
    `,
    data() {
        return {
            mails: [],
            filteredMails: [],
            dir: 'inbox',
            showForm: false,
            mailTemplate: null
        }
    },
    methods: {
        loadMails() {
            mailService.getDir(this.dir).then(mails => this.mails = mails).catch(err => console.log(err))
        },
        changeDir(dir) {
            this.dir = dir;
            this.loadMails();
            if (this.$router.history.current.path === '/mail') this.$router.push;
            else this.$router.push('/mail')
        },
        toggleForm() {
            this.showForm = !this.showForm;
        },
        sendMail(formInput) {
            if (!formInput.to || formInput.to.indexOf('@') < 3) return;
            formInput.sentAt = Date.now();
            mailService.sendMail(formInput).then(mail => {
                if (mail) this.toggleForm();
            })
        },
        saveMail() {
            mailService.saveMail(this.formInput);
        },
        search(str) {
            if (!str) return [];
            return this.mails.filter(mail => {
                return mail.subject.toLowerCase().includes(str.toLowerCase()) ||
                    mail.to.toLowerCase().includes(str.toLowerCase()) ||
                    mail.from.toLowerCase().includes(str.toLowerCase()) ||
                    mail.body.toLowerCase().includes(str.toLowerCase())
            })
        },
        filter(value) {
            if (value === 'all') return this.mails;
            return this.mails.filter(mail => String(mail.isRead) === value)
        }
    },
    created() {
        this.loadMails();
        eventBus.$on('deleteMail', id => {
            mailService.deleteMail(this.dir, id).then(() => {
                // do something
            })
        });
        eventBus.$on('recoverMail', id => {
            mailService.recoverMail(id).then(() => {
                this.changeDir('deleted');
            })
        });
        eventBus.$on('replyMail', mail => {
            this.mailTemplate = mail;
            if (this.showForm) setTimeout(() => this.toggleForm(), 100);
            this.toggleForm();
        });
        eventBus.$on('toggleStar', id => {
            mailService.toggleStar(id).then(() => {
                // do something
            })
        });
        eventBus.$on('search', str => {
            this.filteredMails = this.search(str);
            if (str && !this.filteredMails.length) {
                this.filteredMails.push(null)
            }
        });
        eventBus.$on('filter', filterBy => {
            this.filteredMails = this.filter(filterBy);
            if (filterBy !== 'all' && !this.filteredMails.length) {
                this.filteredMails.push(null)
            }
        });
        eventBus.$on('toggleCompose', () => {
            this.toggleForm();
        })
    },
    computed: {
        unreadMails() {
            if(!this.mails) return 0;
            return this.filter('false').length;
        }
    },
    components: {
        sideMenu,
        emailList,
        emailCompose
    },
}