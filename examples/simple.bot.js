// bot.min.js (Tem que copiar e colar o bundle aqui. Nao da pra carregar no site do Zap)
!function(){var e=function(){function e(){this.events=new Map}return e.prototype.on=function(e,t){this.events.has(e)||this.events.set(e,[]),this.events.get(e).push(t)},e.prototype.emit=function(e,t){this.events.has(e)&&this.events.get(e).forEach(function(e){return e(t)})},e}(),t=function(){function e(e){void 0===e&&(e=50),this._maxSize=e,this._buffer=[]}return e.prototype.append=function(e){return!this.exists(e.digest)&&(this._buffer.length>=this._maxSize&&this._buffer.shift(),this._buffer.push(e),this._allignBufferHistory(e),!0)},e.prototype.size=function(){return this._buffer.length},e.prototype.exists=function(e){return void 0!==this._buffer.find(function(t){return t.digest===e})},e.prototype._allignBufferHistory=function(e){if(!this._newerItem)return void(this._newerItem=e.date);e.date>this._newerItem&&(this._newerItem=e.date)},e.prototype.diffAndMerge=function(e){var t=this,s=this._newerItem||new Date;return s.setMinutes(s.getMinutes()-1),e.filter(function(e){return t.append(e)}).filter(function(e){return e.date>=s})},e}();window.ZapBot=function(){function s(s,i,n){void 0===s&&(s=!1),void 0===i&&(i=!1),void 0===n&&(n=2e3),this._processRetroactive=s,this._startListening=i,this._listenInterval=n,this._firstRun=!0,this._messageBuffer=new t,this._messagesEmitted={},this._tasksProcessed={},this.event=new e,this.minuteTolerance=1,this._startListening&&this.startListen()}return s.prototype.startListen=function(){var e=this;this._startListening||setInterval(function(){return e.listenReceiveMessage()},this._listenInterval)},s.prototype.sendMessage=function(e){var t=document.querySelector(["#main","footer","div.block-compose","div.input-container","div.pluggable-input.pluggable-input-compose","div.pluggable-input-body.copyable-text.selectable-text"].join(">"));if(!t)throw new ReferenceError("Aconteceu algum problema ao enviar essa mensagem");var s=new(window.Event||window.InputEvent)("input",{bubbles:!0}),i=new Date;t.textContent=e,t.dispatchEvent(s),document.querySelector("button.compose-btn-send").click(),this.event.emit("onSend",{message:e,date:i}),this._messagesEmitted[this.hashCode(e,!0)]=e},s.prototype.listenReceiveMessage=function(){var e=this,t=Array.from(document.querySelectorAll(".message-in, .message-out")),s=t.map(function(t){var s=t.querySelector(".bubble").getAttribute("data-pre-plain-text"),i={me:t.classList.contains("message-out"),message:t.querySelector(".selectable-text").innerText,sender:s.split("]").pop().replace(":","").trim(),date:new Date(s.split("]").shift().replace("[","").trim()),digest:0,processDigest:e.hashCode(t.querySelector(".message-text").getAttribute("data-id"))};return i.digest+=e.hashCode(i),i.rawElement=t,i}).filter(function(t){return void 0===e._messagesEmitted[e.hashCode(t.message,!0)]});if(this._firstRun&&!this._processRetroactive)return s.forEach(function(t){return e._tasksProcessed[t.processDigest]=!0}),void(this._firstRun=!1);this._messageBuffer.diffAndMerge(s).filter(function(t){return void 0===e._tasksProcessed[t.processDigest]}).forEach(function(t){e.event.emit("onReceive",t),e._tasksProcessed[t.processDigest]=!0})},s.prototype.hashCode=function(e,t){var s=JSON.stringify(e);return t&&(s=s.replace(/[^a-zA-Z0-9]/g,"")),s.split("").reduce(function(e,t){return(e=(e<<5)-e+t.charCodeAt(0))&e},0)},s}()}();
// ---

// Instancia do Bot
const zap = new ZapBot();

/**
 * Exemplo de todas funcionalidades
 */
zap.event.on('onReceive', (meta) =>
{
    if (meta.me)
    {
        return console.log('Recebi uma mensagem de mim mesmo!', meta);
    }

    console.log('Recebi uma mensagem!', meta);
});

zap.event.on('onSend', (meta) =>
{
    console.log('Enviei uma mensagem!', meta);
});

// Comeca escutar novas mensagens
zap.startListen();

// Manda um hello world pra testar
zap.sendMessage('Hello world!');