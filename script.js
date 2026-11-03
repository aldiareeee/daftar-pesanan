var PRICE=9000;
// [nama, ori, matcha, red velvet, tanda]
var G=[
 {id:"selasa",t:"Selasa",s:"Tmn Ai",k:"s",rows:[
  ["Nanad Manaj B",0,0,1],["Tmn Nanad",2,1,1,"✅"],["Memel",0,1,1],["Sazki",0,1,0],["Teh Enjel",2,0,0],["Audi",0,1,0],
  ["Bina",1,0,0],["Puspa",1,1,0],["Una",0,1,1],["Cino",0,1,0],["Kamila",1,0,0],["Levia",0,0,1]]},
 {id:"kamis",t:"Kamis",s:"Tmn Ai",k:"k",rows:[
  ["Ka Muti",2,2,2],["Gica",1,0,1],["El",0,1,1],["Keysha Kircon",2,0,0],["Keysha Unpas",1,0,2],["Queen",1,1,1],
  ["Sifaa Sixteen",1,1,0],["Asep",1,1,0],["Eca",2,4,0],["Keysha Dance",0,0,1],["Binuy",0,0,1]]},
 {id:"widut",t:"Tmn Widut",s:"Tanpa keterangan hari",k:"w",rows:[
  ["Naila D",0,0,1],["Anbia D",1,1,0]]},
 {id:"kakang",t:"Kakangkasep123",s:"Tanpa keterangan hari",k:"x",rows:[
  ["Anin",0,1,1],["Marsya",0,1,1],["Najwa",0,0,1],["Norine",0,1,0,"✅✅"],["Bunga",1,0,1],["Temen Bunga",0,3,0],
  ["Raisya",3,1,1],["Alin",1,0,1],["Teteh",0,0,2,"✅"]]}
];
var LKEY="daftar-pesanan-v1";
var state={}, col=null; // col tetap null: data disimpan di localStorage perangkat
var saveEl=document.getElementById("save");
function note(t){saveEl.textContent=t;}
function rp(n){return "Rp "+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".");}
function st(key){return state[key]||{paid:false,sent:false};}
function cell(n,c){return n?'<td class="n '+c+'">'+n+'</td>':'<td class="z">·</td>';}

var host=document.getElementById("sections");
G.forEach(function(g){
  var sec=document.createElement("section");sec.className="card";sec.id=g.id;
  var h='<div class="head"><div><h2></h2><p class="sub"></p></div><span class="cnt" id="cnt-'+g.k+'"></span></div>';
  h+='<div class="wrap"><table><thead><tr><th>Nama</th><th>Ori</th><th>Mat</th><th>Red</th><th>Total</th><th>Bayar</th><th>Antar</th></tr></thead><tbody>';
  g.rows.forEach(function(r,i){
    var key=g.k+i, q=r[1]+r[2]+r[3];
    h+='<tr id="r-'+key+'"><td class="nm"><span class="nmt"></span>'+(r[4]?' <small>'+r[4]+'</small>':'')+'</td>'
      +cell(r[1],"o")+cell(r[2],"m")+cell(r[3],"r")
      +'<td class="n">'+(q*PRICE/1000)+'K</td>'
      +'<td class="ck"><input class="b p" type="checkbox" data-k="'+key+'" data-f="paid" aria-label="Sudah bayar"></td>'
      +'<td class="ck"><input class="b" type="checkbox" data-k="'+key+'" data-f="sent" aria-label="Sudah diantar"></td></tr>';
  });
  h+='</tbody><tfoot><tr><td>Jumlah</td><td id="fo-'+g.k+'"></td><td id="fm-'+g.k+'"></td><td id="fr-'+g.k+'"></td><td id="ft-'+g.k+'"></td><td id="fp-'+g.k+'"></td><td id="fs-'+g.k+'"></td></tr></tfoot></table></div>';
  sec.innerHTML=h;
  sec.querySelector("h2").textContent=g.t;
  sec.querySelector(".sub").textContent=g.s;
  var names=sec.querySelectorAll(".nmt");
  g.rows.forEach(function(r,i){names[i].textContent=r[0];});
  host.appendChild(sec);
});
host.addEventListener("change",function(e){
  var el=e.target;if(!el.dataset||!el.dataset.k)return;
  var key=el.dataset.k, cur=st(key), nv={paid:cur.paid,sent:cur.sent};
  nv[el.dataset.f]=el.checked;
  state[key]=nv;render();save(key,nv);
});
function save(key,nv){
  if(col){
    note("Menyimpan...");
    col.doc(key).set(nv).then(function(){note("Tersimpan otomatis");},function(){note("Gagal menyimpan ke server. Coba lagi.");});
  }else{try{localStorage.setItem(LKEY,JSON.stringify(state));}catch(e){}note("Tersimpan di perangkat ini");}
}
function render(){
  var T={o:0,m:0,r:0,q:0,all:0,inn:0,np:0,ns:0,n:0};
  G.forEach(function(g){
    var s={o:0,m:0,r:0,q:0,p:0,s:0};
    g.rows.forEach(function(r,i){
      var key=g.k+i,v=st(key),q=r[1]+r[2]+r[3];
      var tr=document.getElementById("r-"+key);
      tr.className=(v.paid&&v.sent)?"done":"";
      var cs=tr.querySelectorAll("input");cs[0].checked=v.paid;cs[1].checked=v.sent;
      s.o+=r[1];s.m+=r[2];s.r+=r[3];s.q+=q;if(v.paid)s.p++;if(v.sent)s.s++;
      T.o+=r[1];T.m+=r[2];T.r+=r[3];T.q+=q;T.all+=q*PRICE;T.n++;
      if(v.paid){T.inn+=q*PRICE;T.np++;}
      if(v.sent)T.ns++;
    });
    var n=g.rows.length;
    document.getElementById("fo-"+g.k).textContent=s.o;
    document.getElementById("fm-"+g.k).textContent=s.m;
    document.getElementById("fr-"+g.k).textContent=s.r;
    document.getElementById("ft-"+g.k).textContent=(s.q*PRICE/1000)+"K";
    document.getElementById("fp-"+g.k).textContent=s.p+"/"+n;
    document.getElementById("fs-"+g.k).textContent=s.s+"/"+n;
    document.getElementById("cnt-"+g.k).textContent=n+" pemesan · "+s.q+" cookies";
  });
  document.getElementById("tot").textContent=T.q;
  document.getElementById("to").textContent=T.o;
  document.getElementById("tm").textContent=T.m;
  document.getElementById("tr").textContent=T.r;
  document.getElementById("tall").textContent=rp(T.all);
  document.getElementById("inn").textContent=rp(T.inn);
  document.getElementById("out").textContent=rp(T.all-T.inn);
  document.getElementById("np").textContent=T.np+" / "+T.n;
  document.getElementById("ns").textContent=T.ns+" / "+T.n;
}
document.getElementById("reset").addEventListener("click",function(){
  if(!confirm("Hapus semua centang bayar dan antar?"))return;
  G.forEach(function(g){g.rows.forEach(function(r,i){
    var key=g.k+i;state[key]={paid:false,sent:false};
    if(col)col.doc(key).set(state[key]).catch(function(){});
  });});
  if(!col){try{localStorage.setItem(LKEY,JSON.stringify(state));}catch(e){}}
  render();
});
try{var raw=localStorage.getItem(LKEY);if(raw)state=JSON.parse(raw)||{};}catch(e){}
render();note("Tersimpan di perangkat ini");
