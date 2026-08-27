with open("src/pages/TradeTerminal.tsx", "rb") as f:
    content = f.read()

target = b"""                if (currentSeries && (lastCandleRef.current || rawLastCandleRef.current)) {
                    if (idx === 0) {
                       const priceY = currentSeries.priceToCoordinate(currentInterpolatedPriceRef.current);
                       if (timerOverlayRef.current && priceY !== null) {
                           timerOverlayRef.current.style.transform = `translateY(${priceY}px)`;
                       }
                       if (hoverTradeTypeRef.current && lastCandleRef.current) {
                           const y = currentSeries.priceToCoordinate(lastCandleRef.current.close);
                           setHoverLineY(y);
                       } else {
                           setHoverLineY(null);
                       }
                    }"""

target_crlf = target.replace(b"\n", b"\r\n")

replacement = b"""                if (currentSeries && (lastCandleRef.current || rawLastCandleRef.current)) {
                    const priceY = currentSeries.priceToCoordinate(currentInterpolatedPriceRef.current);
                    
                    if (idx === 0) {
                       if (timerOverlayRef.current && priceY !== null) {
                           timerOverlayRef.current.style.transform = `translateY(${priceY}px)`;
                       }
                       if (hoverTradeTypeRef.current && lastCandleRef.current) {
                           const y = currentSeries.priceToCoordinate(lastCandleRef.current.close);
                           setHoverLineY(y);
                       } else {
                           setHoverLineY(null);
                       }
                    }

                    // Update custom half-dotted / half-solid price line
                    const leftLineEl = document.getElementById(`custom-price-line-left-${idx}`);
                    const rightLineEl = document.getElementById(`custom-price-line-right-${idx}`);
                    if (leftLineEl || rightLineEl) {
                        if (priceY !== null && priceY >= 0) {
                            let candleX: number | null = null;
                            const lastTime = rawLastCandleRef.current?.time;
                            if (lastTime) {
                                candleX = ts.timeToCoordinate(lastTime as Time);
                            }
                            
                            const containerWidth = currentContainer?.clientWidth || 600;
                            
                            if (candleX !== null && candleX >= 0) {
                                if (candleX <= containerWidth) {
                                    // Candle is on screen, split line
                                    if (leftLineEl) {
                                        leftLineEl.setAttribute('x1', '0');
                                        leftLineEl.setAttribute('y1', priceY.toString());
                                        leftLineEl.setAttribute('x2', candleX.toString());
                                        leftLineEl.setAttribute('y2', priceY.toString());
                                        leftLineEl.style.display = 'block';
                                    }
                                    if (rightLineEl) {
                                        rightLineEl.setAttribute('x1', candleX.toString());
                                        rightLineEl.setAttribute('y1', priceY.toString());
                                        rightLineEl.setAttribute('x2', '100%');
                                        rightLineEl.setAttribute('y2', priceY.toString());
                                        rightLineEl.style.display = 'block';
                                    }
                                } else {
                                    // Candle is off-screen to the right (future region)
                                    if (leftLineEl) {
                                        leftLineEl.setAttribute('x1', '0');
                                        leftLineEl.setAttribute('y1', priceY.toString());
                                        leftLineEl.setAttribute('x2', '100%');
                                        leftLineEl.setAttribute('y2', priceY.toString());
                                        leftLineEl.style.display = 'block';
                                    }
                                    if (rightLineEl) {
                                        rightLineEl.style.display = 'none';
                                    }
                                }
                            } else {
                                // Fallback: draw dotted line all the way across
                                if (leftLineEl) {
                                    leftLineEl.setAttribute('x1', '0');
                                    leftLineEl.setAttribute('y1', priceY.toString());
                                    leftLineEl.setAttribute('x2', '100%');
                                    leftLineEl.setAttribute('y2', priceY.toString());
                                    leftLineEl.style.display = 'block';
                                }
                                if (rightLineEl) {
                                    rightLineEl.style.display = 'none';
                                }
                            }
                        } else {
                            // Hide both lines if priceY is null
                            if (leftLineEl) leftLineEl.style.display = 'none';
                            if (rightLineEl) rightLineEl.style.display = 'none';
                        }
                    }"""

replacement_crlf = replacement.replace(b"\n", b"\r\n")

if target in content:
    content = content.replace(target, replacement)
    print("Replaced with LF line endings successfully!")
elif target_crlf in content:
    content = content.replace(target_crlf, replacement_crlf)
    print("Replaced with CRLF line endings successfully!")
else:
    print("Target block not found in file!")

with open("src/pages/TradeTerminal.tsx", "wb") as f:
    f.write(content)
