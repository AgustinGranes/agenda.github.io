
"use client";

import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle2, ListVideo, List, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Channel {
  name: string;
  url: string;
}

const EVENT_LIST_URL = "https://stream196tp.com/eventos.html";

const channelsData: { name: string; url: string }[] = [
    { name: 'A24', url: 'https://www.youtube.com/embed/QGpHLgRnrx4?si=NBFgu_PSRDMaOdr1' },
    { name: 'Azteca Deportes MX', url: 'https://streamtp4.com/global1.php?stream=azteca_deportes' },
    { name: 'C5N', url: 'https://www.youtube.com/embed/jTDk5CswBVk?si=1j2k7zbPW2d1wPRs' },
    { name: 'CRONICA', url: 'https://www.youtube.com/embed/avly0uwZzOE?si=QoqQYotYxpJxAZyO' },
    { name: 'Caliente TV', url: 'https://streamtp4.com/global1.php?stream=calientetvmx' },
    { name: 'Canal 11 PT', url: 'https://streamtp4.com/global1.php?stream=canal11_pt' },
    { name: 'Canal 5 MX', url: 'https://streamtp4.com/global1.php?stream=canal5mx' },
    { name: 'Caracol TV', url: 'https://streamtp4.com/global1.php?stream=caracoltv' },
    { name: 'DAZN 1 ES', url: 'https://streamtp4.com/global1.php?stream=dazn1' },
    { name: 'DAZN 2 ES', url: 'https://streamtp4.com/global1.php?stream=dazn2' },
    { name: 'DAZN LaLiga', url: 'https://streamtp4.com/global1.php?stream=dazn_laliga' },
    { name: 'Dsports', url: 'https://streamtp4.com/global1.php?stream=dsports' },
    { name: 'Dsports +', url: 'https://streamtp4.com/global1.php?stream=dsportsplus' },
    { name: 'Dsports 2', url: 'https://streamtp4.com/global1.php?stream=dsports2' },
    { name: 'ESPN 1', url: 'https://streamtp4.com/global1.php?stream=espn' },
    { name: 'ESPN 1 BR', url: 'https://streamtp4.com/global1.php?stream=espn1br' },
    { name: 'ESPN 1 NL', url: 'https://streamtp4.com/global1.php?stream=espn_nl1' },
    { name: 'ESPN 2', url: 'https://streamtp4.com/global1.php?stream=espn2' },
    { name: 'ESPN 2 BR', url: 'https://streamtp4.com/global1.php?stream=espn2br' },
    { name: 'ESPN 2 MX', url: 'https://streamtp4.com/global1.php?stream=espn2mx' },
    { name: 'ESPN 2 NL', url: 'https://streamtp4.com/global1.php?stream=espn_nl2' },
    { name: 'ESPN 3', url: 'https://streamtp4.com/global1.php?stream=espn3' },
    { name: 'ESPN 3 BR', url: 'https://streamtp4.com/global1.php?stream=espn3br' },
    { name: 'ESPN 3 MX', url: 'https://streamtp4.com/global1.php?stream=espn3mx' },
    { name: 'ESPN 3 NL', url: 'https://streamtp4.com/global1.php?stream=espn_nl3' },
    { name: 'ESPN 4', url: 'https://streamtp4.com/global1.php?stream=espn4' },
    { name: 'ESPN 4 BR', url: 'https://streamtp4.com/global1.php?stream=espn4br' },
    { name: 'ESPN 5', url: 'https://streamtp4.com/global1.php?stream=espn5' },
    { name: 'ESPN 6', url: 'https://streamtp4.com/global1.php?stream=espn6' },
    { name: 'ESPN 7', url: 'https://streamtp4.com/global1.php?stream=espn7' },
    { name: 'ESPN ARGENTINA', url: 'https://stream196tp.com/global1.php?stream=eventos8' },
    { name: 'ESPN Deportes USA', url: 'https://streamtp4.com/global1.php?stream=espndeportes' },
    { name: 'ESPN MX', url: 'https://streamtp4.com/global1.php?stream=espnmx' },
    { name: 'ESPN Premium Argentina', url: 'https://streamtp4.com/global1.php?stream=espnpremium' },
    { name: 'Eleven Sports 1 PT', url: 'https://streamtp4.com/global1.php?stream=eleven1_pt' },
    { name: 'Eleven Sports 2 PT', url: 'https://streamtp4.com/global1.php?stream=eleven2_pt' },
    { name: 'Eleven Sports 3 PT', url: 'https://streamtp4.com/global1.php?stream=eleven3_pt' },
    { name: 'Eleven Sports 4 PT', url: 'https://streamtp4.com/global1.php?stream=eleven4_pt' },
    { name: 'Eleven Sports 5 PT', url: 'https://streamtp4.com/global1.php?stream=eleven5_pt' },
    { name: 'FUTV (EV)', url: 'https://streamtp4.com/global1.php?stream=futv' },
    { name: 'Fox Deportes TUBI', url: 'https://streamtp4.com/global1.php?stream=tubitv1' },
    { name: 'Fox Deportes USA', url: 'https://streamtp4.com/global1.php?stream=fox_deportes_usa' },
    { name: 'Fox Sports 1 (Argentina)', url: 'https://streamtp4.com/global1.php?stream=fox1ar' },
    { name: 'Fox Sports 1 MX', url: 'https://streamtp4.com/global1.php?stream=foxsportsmx' },
    { name: 'Fox Sports 1 USA', url: 'https://streamtp4.com/global1.php?stream=fox_1_usa' },
    { name: 'Fox Sports 2 (Argentina)', url: 'https://streamtp4.com/global1.php?stream=fox2ar' },
    { name: 'Fox Sports 2 MX', url: 'https://streamtp4.com/global1.php?stream=foxsports2mx' },
    { name: 'Fox Sports 2 USA', url: 'https://streamtp4.com/global1.php?stream=fox_2_usa' },
    { name: 'Fox Sports 3 (Argentina)', url: 'https://streamtp4.com/global1.php?stream=fox3ar' },
    { name: 'Fox Sports 3 MX', url: 'https://streamtp4.com/global1.php?stream=foxsports3mx' },
    { name: 'Fox Sports Premium', url: 'https://streamtp4.com/global1.php?stream=foxsportspremium' },
    { name: 'GolPeru', url: 'https://streamtp4.com/global1.php?stream=golperu' },
    { name: 'GolTV', url: 'https://streamtp4.com/global1.php?stream=goltv' },
    { name: 'Gran Hermano CAM 1', url: 'https://streamtp4.com/global1.php?stream=grahermanocam1' },
    { name: 'Gran Hermano CAM 2', url: 'https://streamtp4.com/global1.php?stream=grahermanocam2' },
    { name: 'Gran Hermano CAM 3', url: 'https://streamtp4.com/global1.php?stream=grahermanocam3' },
    { name: 'Gran Hermano CAM 24H', url: 'https://streamtp4.com/global1.php?stream=granhermanocamara24horas' },
    { name: 'Gran Hermano MultiCAM', url: 'https://streamtp4.com/global1.php?stream=granhermanomulticam' },
    { name: 'HI! Sports MX', url: 'https://streamtp4.com/global1.php?stream=hisports' },
    { name: 'LN+', url: 'https://www.youtube.com/embed/OR9MH16MKrg?si=DIfW0Kw81r6pmy3s' },
    { name: 'LaLiga Hypermotion', url: 'https://streamtp4.com/global1.php?stream=laligahypermotion' },
    { name: 'Liga 1 MAX', url: 'https://streamtp4.com/global1.php?stream=liga1max' },
    { name: 'Movistar Liga de Campeones', url: 'https://streamtp4.com/global1.php?stream=movistarligadecampeones' },
    { name: 'OnBoard Colapinto (SI HAY F1)', url: 'https://stream196tp.com/global1.php?stream=disney16' },
    { name: 'OnBoard General (SI HAY F1)', url: 'https://stream196tp.com/global1.php?stream=disney18' },
    { name: 'Premiere 1 BR', url: 'https://streamtp4.com/global1.php?stream=premiere1' },
    { name: 'Premiere 2 BR', url: 'https://streamtp4.com/global1.php?stream=premiere2' },
    { name: 'Premiere 3 BR', url: 'https://streamtp4.com/global1.php?stream=premiere3' },
    { name: 'Sky Sports Bundesliga 1', url: 'https://streamtp4.com/global1.php?stream=sky_bundesliga1' },
    { name: 'Sky Sports Bundesliga 2', url: 'https://streamtp4.com/global1.php?stream=sky_bundesliga2' },
    { name: 'Sky Sports Bundesliga 3', url: 'https://streamtp4.com/global1.php?stream=sky_bundesliga3' },
    { name: 'Sky Sports Bundesliga 4', url: 'https://streamtp4.com/global1.php?stream=sky_bundesliga4' },
    { name: 'Sky Sports Bundesliga 5', url: 'https://streamtp4.com/global1.php?stream=sky_bundesliga5' },
    { name: 'Sport TV 1 BR', url: 'https://streamtp4.com/global1.php?stream=sporttvbr1' },
    { name: 'Sport TV 1 PT', url: 'https://streamtp4.com/global1.php?stream=sportv_1pt' },
    { name: 'Sport TV 2 BR', url: 'https://streamtp4.com/global1.php?stream=sporttvbr2' },
    { name: 'Sport TV 2 PT', url: 'https://streamtp4.com/global1.php?stream=sportv_2pt' },
    { name: 'Sport TV 3 BR', url: 'https://streamtp4.com/global1.php?stream=sporttvbr3' },
    { name: 'Sport TV 3 PT', url: 'https://streamtp4.com/global1.php?stream=sportv_3pt' },
    { name: 'Sport TV 4 PT', url: 'https://streamtp4.com/global1.php?stream=sportv_4pt' },
    { name: 'Sport TV 5 PT', url: 'https://streamtp4.com/global1.php?stream=sporttv5' },
    { name: 'Sport TV 6 PT', url: 'https://streamtp4.com/global1.php?stream=sporttv6' },
    { name: 'TN', url: 'https://www.youtube.com/embed/cb12KmMMDJA?si=CsUytnnQFJxMs8fL' },
    { name: 'TNT 1 GB', url: 'https://streamtp4.com/global1.php?stream=tnt_1_gb' },
    { name: 'TNT 2 GB', url: 'https://streamtp4.com/global1.php?stream=tnt_2_gb' },
    { name: 'TNT UK 2', url: 'https://alangulotv2.com/?channel=tntuk2'},
    { name: 'TNT 3 GB', url: 'https://streamtp4.com/global1.php?stream=tnt_3_gb' },
    { name: 'TNT 4 GB', url: 'https://streamtp4.com/global1.php?stream=tnt_4_gb' },
    { name: 'TNT Sports Argentina', url: 'https://streamtp4.com/global1.php?stream=tntsports' },
    { name: 'TNT Sports Chile', url: 'https://streamtp4.com/global1.php?stream=tntsportschile' },
    { name: 'TSN 1', url: 'https://streamtp4.com/global1.php?stream=tsn1' },
    { name: 'TSN 2', url: 'https://streamtp4.com/global1.php?stream=tsn2' },
    { name: 'TSN 3', url: 'https://streamtp4.com/global1.php?stream=tsn3' },
    { name: 'TSN 4', url: 'https://streamtp4.com/global1.php?stream=tsn4' },
    { name: 'TSN 5', url: 'https://streamtp4.com/global1.php?stream=tsn5' },
    { name: 'TV Pública', url: 'https://streamtp4.com/global1.php?stream=tv_publica' },
    { name: 'TVC Deportes MX', url: 'https://streamtp4.com/global1.php?stream=tvc_deportes' },
    { name: 'TUDN MX', url: 'https://streamtp4.com/global1.php?stream=TUDNMX' },
    { name: 'TUDN USA', url: 'https://streamtp4.com/global1.php?stream=tudn_usa' },
    { name: 'Telefe', url: 'https://streamtp4.com/global1.php?stream=telefe' },
    { name: 'Telemetria F1 (SI HAY F1)', url: 'https://alangulo-dashboard-f1.vercel.app' },
    { name: 'TyC Sports', url: 'https://streamtp4.com/global1.php?stream=tycsports' },
    { name: 'TyC Sports Internacional', url: 'https://streamtp4.com/global1.php?stream=tycinternacional' },
    { name: 'USA Network', url: 'https://streamtp4.com/global1.php?stream=usa_network' },
    { name: 'Universo USA', url: 'https://streamtp4.com/global1.php?stream=universo_usa' },
    { name: 'Univisíon USA', url: 'https://streamtp4.com/global1.php?stream=univision_usa' },
    { name: 'VTV +', url: 'https://streamtp4.com/global1.php?stream=vtvplus' },
    { name: 'Vamos ES', url: 'https://streamtp4.com/global1.php?stream=vamoses' },
    { name: 'Win Play +', url: 'https://streamtp4.com/global1.php?stream=winplusonline1' },
    { name: 'Win Sports', url: 'https://streamtp4.com/global1.php?stream=winsports' },
    { name: 'Win Sports +', url: 'https://streamtp4.com/global1.php?stream=winplus' },
    { name: 'Win Sports + (Op2)', url: 'https://streamtp4.com/global1.php?stream=winplus2' },
    { name: 'Eurosport 1', url: 'https://elcanaldeportivo.com/eurosports1.php' },
    { name: 'Eurosport 2', url: 'https://elcanaldeportivo.com/eurosports2.php' },
    { name: 'El canal del Futbol', url: 'https://elcanaldeportivo.com/ecfutbol.php' },
    { name: 'DAZN F1', url: 'https://elcanaldeportivo.com/daznf1.php' },
    { name: 'SSC 1', url: 'https://elcanaldeportivo.com/ssc1.php' },
    { name: 'SSC 2', url: 'https://elcanaldeportivo.com/ssc2.php' },
    { name: 'SSC NEWS', url: 'https://elcanaldeportivo.com/sscnews.php' },
    { name: 'SSC EXTRA 1', url: 'https://elcanaldeportivo.com/sscextra1.php' },
    { name: 'SSC EXTRA 2', url: 'https://elcanaldeportivo.com/sscextra2.php' },
    { name: 'AZTECA 7', url: 'https://elcanaldeportivo.com/azteca7.php' },
    { name: 'ATV', url: 'https://elcanaldeportivo.com/atv.php' },
    { name: 'History 1', url: 'https://tvlibreonline.org/html/fl/?get=SGlzdG9yeUhE' },
    { name: 'History 2', url: 'https://tvlibreonline.org/html/fl/?get=SGlzdG9yeV8y' },
    { name: 'Animal Planet', url: 'https://tvlibreonline.org/html/fl/?get=QW5pbWFsUGxhbmV0' },
    { name: 'National Geographic', url: 'https://tvlibreonline.org/html/fl/?get=TmF0R2VvSEQ=' },
    { name: 'TLC', url: 'https://tvlibreonline.org/html/fl/?get=VExD' },
    { name: 'Comedy Central', url: 'https://tvlibreonline.org/html/fl/?get=Q29tZWR5Q2VudHJhbA' },
    { name: 'Telemundo', url: 'https://tvlibreonline.org/html/fl/?get=VGVsZW11bmRvX0hE' },
    { name: 'TNT', url: 'https://tvlibreonline.org/html/fl/?get=VE5UX0hEX0FyZw==' },
    { name: 'Garage TV', url: 'https://tvlibreonline.org/html/fl/?get=RWxfR2FyYWdl' },
    { name: 'Adult Swim', url: 'https://tvlibreonline.org/html/fl/?get=QWR1bHRfU3dpbQ==' },
    { name: 'MTV', url: 'https://tvlibreonline.org/html/fl/?get=TVRWX0hE' },
    { name: 'Flow Music', url: 'https://tvlibreonline.org/html/fl/?get=Rmxvd19NdXNpY19YUA==' },
    { name: 'VENUS (+18)', url: 'https://tvlibreonline.org/html/fl/?get=VmVudXM=' },
    { name: 'Playboy (+18)', url: 'https://tvlibreonline.org/html/fl/?get=UGxheWJveQ' },
    { name: 'Sextreme (+18)', url: 'https://tvlibreonline.org/html/fl/?get=U2V4dHJlbWU' },
];

const uniqueChannelsMap = new Map<string, Channel>();
channelsData.forEach(channel => {
  if (!uniqueChannelsMap.has(channel.url)) {
    uniqueChannelsMap.set(channel.url, channel);
  }
});
const channels: Channel[] = Array.from(uniqueChannelsMap.values())
  .sort((a, b) => a.name.localeCompare(b.name));


interface CopiedStates {
  [key: string]: boolean;
}

export const ChannelListComponent: FC = () => {
  const [copiedStates, setCopiedStates] = useState<CopiedStates>({});
  const [activeAccordionItems, setActiveAccordionItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleAccordionChange = (value: string[]) => {
    if (!value.includes('channel-list-content') && activeAccordionItems.includes('channel-list-content')) {
       setSearchTerm('');
    }
    setActiveAccordionItems(value);
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedStates(prev => ({ ...prev, [url]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [url]: false }));
      }, 1000);
    } catch (err) {
      console.error("Error al copiar: ", err);
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="mb-6 shadow-lg w-full h-full flex flex-col">
      <Accordion
        type="multiple"
        value={activeAccordionItems}
        onValueChange={handleAccordionChange}
        className="w-full flex flex-col flex-grow"
      >
        <AccordionItem value="channel-list-content" className="border-b-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center text-xl font-semibold text-primary">
                <List className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="truncate">Lista de Canales</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 min-h-0">
            <div className="px-6 pb-4">
              <div className="relative flex flex-1 items-center w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar canal..."
                  className="h-9 w-full pl-10 pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto px-6 pb-4">
              {filteredChannels.length > 0 ? (
                <ul className="space-y-3">
                  {filteredChannels.map((channel) => (
                    <li key={channel.url} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="text-foreground mr-2 flex-1 truncate" title={channel.name}>{channel.name}</span>
                      <Button
                        size="sm"
                        onClick={() => handleCopy(channel.url)}
                        className={cn(
                          "transition-colors duration-300 w-[140px]",
                          copiedStates[channel.url]
                            ? "bg-green-500 hover:bg-green-600 text-white border border-green-500 hover:border-green-600"
                            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground"
                        )}
                      >
                        {copiedStates[channel.url] ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copiedStates[channel.url] ? "¡Copiado!" : "Copiar Enlace"}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  {searchTerm ? `No se encontraron canales para "${searchTerm}".` : "No hay canales disponibles."}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="event-list" className="border-b-0">
          <AccordionTrigger className="px-6 py-4 text-xl font-semibold text-primary hover:no-underline">
            <div className="flex items-center">
              <ListVideo className="mr-2 h-5 w-5" />
              Lista de Eventos
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 min-h-0">
            <div className="px-6 pb-4">
              <div className="h-[500px] w-full rounded-md overflow-hidden border border-border shadow">
                <iframe
                    src={EVENT_LIST_URL}
                    title="Lista de Eventos"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

