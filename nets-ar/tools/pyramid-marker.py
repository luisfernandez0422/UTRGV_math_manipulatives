"""Generate the fourth AR marker and append its sheet to the original PDF."""
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageDraw
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
root=Path(__file__).resolve().parents[1]
inner=Image.new('L',(16,16),255)
d=ImageDraw.Draw(inner)
# Asymmetric block P, with a detached lower-right square.
d.rectangle((3,2,5,13),fill=0)
d.rectangle((6,2,12,4),fill=0)
d.rectangle((10,5,12,7),fill=0)
d.rectangle((6,7,12,9),fill=0)
d.rectangle((10,12,12,14),fill=0)
marker=Image.new('L',(1000,1000),255)
ImageDraw.Draw(marker).rectangle((100,100,899,899),fill=0)
marker.paste(inner.resize((400,400),Image.Resampling.NEAREST),(300,300))
marker.save(root/'assets/pyramid.png')
# Match the existing marker files' channel/rotation convention exactly.
values=list(map(int,(root/'assets/cube.patt').read_text().split()))
base=values[:256]
def rot(vals): return [vals[x*16+15-y] for y in range(16) for x in range(16)]
turns=[]; a=base
for k in range(4):
 turns.append(a);a=rot(a)
order=[turns.index(values[k*768:k*768+256]) for k in range(4)]
blocks=[];pixels=list(inner.getdata());turns=[]
for k in range(4):turns.append(pixels);pixels=rot(pixels)
for k in order:
 channel='\n'.join(' '.join(f'{v:3d}' for v in turns[k][i:i+16]) for i in range(0,256,16))
 blocks.append('\n'.join([channel]*3))
(root/'assets/pyramid.patt').write_text('\n\n'.join(blocks)+'\n')
buf=BytesIO();c=canvas.Canvas(buf,pagesize=letter)
c.setFillColorRGB(.72,.26,0);c.setFont('Helvetica-Bold',10)
c.drawString(54,745,'DR. FERNANDEZ / NETS OF POLYHEDRA')
c.setFillColorRGB(.15,.17,.2);c.setFont('Helvetica-Bold',24)
c.drawString(54,712,'Square pyramid');c.setFont('Helvetica',11)
c.drawString(54,691,'Marker 04  /  Scan. Predict. Unfold. Refold.')
c.drawImage(str(root/'assets/pyramid.png'),116,284,width=380,height=380)
c.setFont('Helvetica-Bold',11)
c.drawCentredString(306,276,'SOLID  <----------  UNFOLD SLIDER  ---------->  NET')
c.setFont('Helvetica',10)
for y,line in [(248,'1. Open the activity link below on your phone.'),(232,'2. Tap Start AR camera and allow camera access.'),(216,'3. Point at the whole marker, then move the Unfold slider.')]: c.drawString(54,y,line)
c.setFont('Helvetica-Bold',9);c.setFillColorRGB(.72,.26,0)
c.drawString(54,187,'OPEN THE ACTIVITY');c.setFont('Helvetica',8)
url='https://luisfernandez0422.github.io/UTRGV_math_manipulatives/nets-ar/'
c.drawString(54,172,url);c.linkURL(url,(54,170,540,182))
c.setFillColorRGB(.15,.17,.2);c.setFont('Helvetica-Bold',11)
c.drawString(54,143,'Which triangular edges meet at the apex?')
c.setFont('Helvetica',8)
for y,line in [(112,'Print at 100% on matte white paper. Preserve the white margin around the black square.'),(99,'Start 20-40 cm away; move farther back to view the full net. Use one sheet at a time.'),(86,'This is a tracking marker, not a QR code. Open the activity link before scanning.')]: c.drawString(54,y,line)
c.showPage();c.save();buf.seek(0)
r=PdfReader(root/'print-markers.pdf');w=PdfWriter()
for page in r.pages[:3]:w.add_page(page)
w.add_page(PdfReader(buf).pages[0])
with (root/'print-markers.pdf').open('wb') as f:w.write(f)
print('Generated pyramid marker and four-page marker PDF; rotation order:',order)
