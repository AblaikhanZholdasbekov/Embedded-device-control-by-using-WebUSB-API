#include <WebUSB.h>

/**
 * Creating an instance of WebUSBSerial will add an additional USB interface to
 * the device that is marked as vendor-specific (rather than USB CDC-ACM) and
 * is therefore accessible to the browser.
 *
 * The URL here provides a hint to the browser about what page the user should
 * navigate to to interact with the device.
 */
WebUSB WebUSBSerial(1 /* https:// */, "http://127.0.0.1:5501/demos/fire_station/");

#define Serial WebUSBSerial

const int buzzerPin = 5;
const int flamePin = 4;
const int ledPin=6;
int Flame = LOW;

void setup() 
{
   while (!Serial) {
    ;
  }
   Serial.begin(9600);
  Serial.write("Sketch begins.\r\n> ");
  Serial.flush();
  pinMode(buzzerPin, OUTPUT);
  pinMode(flamePin, INPUT);
  pinMode(ledPin, OUTPUT);
 
}

void loop() 
{
  if (Serial && Serial.available()) {
    int FlameBtn=Serial.read();
    Serial.write(FlameBtn);  
      
    do {
    //int Flame = HIGH;
    Flame = digitalRead(flamePin);

    if (Flame==LOW){
    Serial.println(" Fire is Detected");
    digitalWrite(buzzerPin, HIGH);
    digitalWrite(ledPin, HIGH);
  }
   
   if (Flame==HIGH) {
    Serial.println(" Fire is not Detected");
    digitalWrite(buzzerPin, LOW);
    digitalWrite(ledPin, LOW);
} 

 
 } while (FlameBtn=='H' && FlameBtn!='L' );

//if (FlameBtn == 'L') {
    Serial.println(" The system is off");
    digitalWrite(buzzerPin, LOW);
    digitalWrite(ledPin, LOW);
    //} 
  
  
  
  
   Serial.write("\r\n> ");
   Serial.flush();
  
}
}
